# System Architecture Specification: Modular Multi-Survey Portal

## 1. System Topology & ASCII Architecture Diagram

```
+-----------------------------------------------------------------------------------+
|                                  CLIENT LAYER                                     |
|                                                                                   |
|  +----------------------------------+       +----------------------------------+  |
|  |       Respondent Client          |       |     Surveyor / Admin Console     |  |
|  |   - Dynamic Step-by-Step Wizard  |       |   - Campaign CRUD & T&C Editor   |  |
|  |   - Instant Field Validation     |       |   - Live Metric Dashboards       |  |
|  |   - Mandatory T&C Consent Gate   |       |   - Filterable Response Explorer |  |
|  |   - LocalStorage Draft Cache     |       |   - CSV / JSON Secure Exporter   |  |
|  +----------------------------------+       +----------------------------------+  |
+------------------------------------------+----------------------------------------+
                                           | HTTPS / JSON
                                           v
+-----------------------------------------------------------------------------------+
|                        APPLICATION LAYER (Next.js App Router)                     |
|                                                                                   |
|  +-----------------------------+                 +-----------------------------+  |
|  |    Public Survey Engine     |                 |     Admin API & Security    |  |
|  |   - Dynamic Slug Resolver   |                 |   - Session Auth Middleware |  |
|  |     (/s/[campaignSlug])     |                 |   - Role-Based Access Gate  |  |
|  |   - Zod Payload Validator   |                 |   - Campaign Schema Manager |  |
|  |   - Consent Verification    |                 |   - Rate Limiter & Honeypot |  |
|  +-----------------------------+                 +-----------------------------+  |
+------------------------------------------+----------------------------------------+
                                           | Prisma ORM (Type-Safe Data Access)
                                           v
+-----------------------------------------------------------------------------------+
|                           PERSISTENCE LAYER (Storage Vault)                       |
|                                                                                   |
|  +-------------------------+  +--------------------------+  +-------------------+ |
|  |     Campaign Store      |  |     Consent Ledger       |  |   Response Vault  | |
|  |  - Slug & Metadata      |  |  - Exact T&C Version Hash|  |  - Question/Answer| |
|  |  - Declarative Schema   |  |  - ISO-8601 Timestamp    |  |    JSON Payload   | |
|  |  - Active/Paused State  |  |  - IP & User-Agent Proof |  |  - Encrypted PII  | |
|  +-------------------------+  +--------------------------+  +-------------------+ |
|                                                                                   |
|  *Storage Engine Options: PostgreSQL (Production Cloud/Neon) / SQLite (Local Dev)* |
+-----------------------------------------------------------------------------------+
```

---

## 2. Tech Stack Justification & Trade-Off Analysis

| Layer | Chosen Technology | Justification & `/boost` Trade-Off Analysis |
| :--- | :--- | :--- |
| **Framework** | Next.js 14/15 (App Router) | Unified TypeScript codebase spanning SSR client components, server actions, and API routes. Eliminates API boilerplate and enables instant route compilation with zero client-server drift. |
| **Language** | TypeScript (Strict Mode) | End-to-end type safety from declarative survey schema to client validation and database persistence layer. Guarantees compile-time boundary enforcement. |
| **Styling** | Tailwind CSS + Lucide Icons | Utility-first design tokens for high-performance layout rendering with zero runtime CSS overhead, accessible color contrasts, and seamless dark/light adaptation. |
| **Validation** | Zod | Runtime schema validation for dynamic survey questions and incoming submission payloads. Rejects malicious or malformed payloads before database transactions. |
| **Data Layer** | Prisma ORM + Serverless Cloud PostgreSQL (Neon / Supabase) | Abstracted database client connecting to a serverless persistent PostgreSQL instance via `DATABASE_URL`. Solves the ephemeral storage problem when deploying online (e.g. Vercel, Railway, Render) so survey submissions are never wiped on container restarts or redeploys, while retaining zero-config local prototyping capabilities. |
| **State / Cache** | Client `sessionStorage` + Server-side Invalidation | Prevents survey respondent data loss across accidental browser reloads while enforcing immediate server-side cache clearing upon campaign updates. |

---

## 3. Strict Project Folder Structure & Ownership Matrix

```
e:\projects\survey\
├── src/
│   ├── app/
│   │   ├── (public)/
│   │   │   ├── s/
│   │   │   │   └── [campaignSlug]/
│   │   │   │       ├── page.tsx               # Respondent survey entry point
│   │   │   │       └── layout.tsx             # Clean respondent container layout
│   │   │   ├── terms/
│   │   │   │   └── page.tsx                   # Dedicated public legal terms viewer
│   │   │   └── page.tsx                       # Portal landing page
│   │   ├── admin/
│   │   │   ├── campaigns/
│   │   │   │   ├── [id]/page.tsx              # Campaign editor & analytics
│   │   │   │   └── page.tsx                   # Campaign management list
│   │   │   ├── responses/
│   │   │   │   └── page.tsx                   # Submissions data explorer & export
│   │   │   └── layout.tsx                     # Secured admin navigation shell
│   │   └── api/
│   │       ├── surveys/
│   │       │   └── [campaignSlug]/
│   │       │       └── submit/route.ts        # Secure response ingestion endpoint
│   │       └── export/route.ts                # Streamed CSV/JSON export endpoint
│   ├── components/
│   │   ├── survey/
│   │   │   ├── WizardContainer.tsx            # Multi-step coordinator & progress bar
│   │   │   ├── QuestionRenderer.tsx           # Polymorphic question input dispatcher
│   │   │   ├── StepTermsConsentModal.tsx      # Mandatory T&C modal & verification gate
│   │   │   └── CompletionScreen.tsx           # Success receipt & reference ID
│   │   ├── admin/
│   │   │   ├── CampaignEditor.tsx             # Declarative schema editor & toggles
│   │   │   ├── ResponseTable.tsx              # Virtualized tabular data viewer
│   │   │   └── MetricCard.tsx                 # Completion and conversion KPI card
│   │   └── ui/                                # Foundational design token primitives
│   ├── lib/
│   │   ├── db.ts                              # Prisma client singleton
│   │   ├── schema.ts                          # Zod schema definitions for surveys
│   │   ├── rate-limit.ts                      # Bot throttling & IP bucket limits
│   │   └── sanitize.ts                        # Text and PII sanitization utilities
│   └── types/
│       └── survey.ts                          # Core domain TypeScript interfaces
├── prisma/
│   └── schema.prisma                          # Prisma relational data model
├── public/                                    # Static assets & legal documents
├── package.json                               # Dependencies & npm scripts
├── tsconfig.json                              # TypeScript strict configuration
└── tailwind.config.ts                         # Custom design tokens & theme palette
```

### File Ownership & Responsibility Matrix

| Path / Module | Primary Owner | Architectural Purpose |
| :--- | :--- | :--- |
| `src/app/(public)/s/[campaignSlug]/page.tsx` | Frontend Agent | Handles dynamic route resolution, campaign loading, and wizard orchestration. |
| `src/components/survey/StepTermsConsentModal.tsx` | Compliance / UI Agent | Enforces non-bypassable modal review and checkbox consent for legal T&C. |
| `src/app/api/surveys/[campaignSlug]/submit/route.ts` | Backend / Security Agent | Ingests respondent answers, verifies consent proof, and executes atomic DB transaction. |
| `src/lib/rate-limit.ts` | Security Agent | Protects public intake routes against bot floods and denial-of-service spam. |
| `src/app/api/export/route.ts` | Data Pipeline Agent | Streams filtered survey responses into structured CSV and JSON artifacts. |
| `prisma/schema.prisma` | Database Lead | Defines authoritative data schemas, relations, and index optimizations. |

---

## 4. Authoritative Data Model & Schema Specification

```prisma
datasource db {
  provider = "postgresql" // Or "sqlite" during local prototype testing
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Campaign {
  id            String       @id @default(cuid())
  slug          String       @unique
  title         String
  description   String?
  isActive      Boolean      @default(true)
  tcVersion     String       @default("1.0.0")
  tcContent     String       // Full Markdown or legal text of Terms & Conditions
  schemaJson    String       // Declarative JSON structure of questions & step flow
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
  responses     Response[]
  consents      ConsentLog[]

  @@index([slug])
}

model Response {
  id            String       @id @default(cuid())
  campaignId    String
  campaign      Campaign     @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  answersJson   String       // Serialized validated respondent answers
  respondentRef String?      // Optional pseudonymous tracking identifier
  completionSec Int          // Time spent in seconds to complete
  createdAt     DateTime     @default(now())
  consent       ConsentLog?

  @@index([campaignId, createdAt])
}

model ConsentLog {
  id            String       @id @default(cuid())
  campaignId    String
  campaign      Campaign     @relation(fields: [campaignId], references: [id], onDelete: Cascade)
  responseId    String       @unique
  response      Response     @relation(fields: [responseId], references: [id], onDelete: Cascade)
  tcVersion     String       // Exact T&C version agreed to
  tcChecksum    String       // SHA-256 hash of T&C text at time of acceptance
  ipHash        String       // Anonymized/hashed IP address for audit verification
  userAgent     String       // Client user agent string
  agreedAt      DateTime     @default(now())

  @@index([campaignId, tcChecksum])
}

model AdminUser {
  id            String       @id @default(cuid())
  username      String       @unique
  passwordHash  String
  createdAt     DateTime     @default(now())
}
```

---

## 5. Multi-Agent Teamwork Specification

| Subagent Role | Isolation Mode | Primary Responsibility & Execution Boundaries |
| :--- | :--- | :--- |
| **Architect Agent** | `inherit` | Preserves systemic integrity, reviews schema migrations, and updates `Memory.md`. |
| **Frontend / UI Agent** | `share` | Builds accessible wizard navigation, custom input components, and modal interfaces. |
| **Backend / API Agent** | `share` | Implements secure endpoints, Zod schema validation, and CSV export streaming. |
| **Database / Migration Agent** | `inherit` | Manages Prisma schema migrations, seed scripts, and connection pool configurations. |
| **Security & QA Agent** | `share` | Enforces rate limits, validates T&C cryptographic hashes, and executes test suites. |

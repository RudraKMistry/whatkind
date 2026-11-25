# Project Requirements Document (PRD): Modular Multi-Survey Portal

## 1. User Personas

### Primary Persona: The Lead Surveyor / Intelligence Operator
- **Name:** Dr. Evelyn Reed (Research & Intelligence Director)
- **Role:** Campaigns orchestrator responsible for deploying multi-cohort demographic and informational surveys, overseeing data integrity, and extracting validated respondent intelligence.
- **Pain Points:** 
  - Difficulty managing multiple disparate campaigns without cross-contamination.
  - Legal exposure from ambiguous, unrecorded respondent consent or missing Terms & Conditions acceptance.
  - Poor data quality resulting from unvalidated form inputs and high abandonment rates on cumbersome forms.
- **Goals:** 
  - Deploy targeted, modular survey campaigns via distinct URL slugs with zero engineering downtime.
  - Ensure every captured submission holds an immutable consent record with exact T&C version stamp.
  - View real-time response counters, completion percentages, and export sanitized datasets in CSV/JSON formats.

### Secondary Persona: The Survey Respondent
- **Name:** Marcus Chen (General Public / Targeted Demographic Respondent)
- **Role:** End-user arriving at a specific survey campaign via mobile device, tablet, or desktop browser.
- **Pain Points:** 
  - Long, overwhelming single-page forms that lose progress upon accidental refresh.
  - Sluggish, unoptimized UI with confusing question layouts and hidden submission requirements.
  - Skepticism regarding data privacy, legitimacy, and terms of data usage.
- **Goals:** 
  - Experience a sleek, fast, intuitive multi-step questionnaire with visual progress indicators.
  - Read transparent Terms & Conditions and understand clearly what data is being collected and how it is used.
  - Complete the survey in under 3 minutes with instant validation feedback and a clear confirmation screen.

---

## 2. Core User Stories & Acceptance Criteria

### US-01: Multi-Campaign Dynamic Ingestion Flow
- **As a** Respondent,
- **I want** to access a specific survey campaign via its unique URL slug (e.g., `/s/demographics-2026`),
- **So that** I am presented with the exact questions and parameters tailored to that research initiative.
- **Acceptance Criteria:**
  1. System resolves valid campaign slugs and loads the corresponding survey configuration dynamically.
  2. If the campaign slug does not exist or is marked inactive, a clean 404/Inactive Campaign screen is displayed.
  3. Dynamic step-by-step wizard renders question cards categorized by topic (e.g., Demographics, Habits, Feedback).

### US-02: Mandatory Legal Terms & Conditions Gate
- **As a** Surveyor and Compliance Officer,
- **I want** respondents to explicitly review and accept the Terms & Conditions and Privacy Policy prior to submission,
- **So that** every dataset row is legally compliant, consensual, and auditable.
- **Acceptance Criteria:**
  1. The final step before submission enforces an interactive Terms & Conditions modal and mandatory checkbox confirmation.
  2. The submission payload rejects with HTTP 400 if the consent confirmation flag is missing or false.
  3. The database persists the exact T&C version ID, ISO-8601 timestamp, and client IP/User-Agent metadata in the `ConsentLedger`.

### US-03: Real-Time Input Validation & Dynamic Question Types
- **As a** Respondent,
- **I want** immediate, helpful feedback on input errors (e.g., invalid email, missing required selections, out-of-range numeric values),
- **So that** I can correct mistakes before proceeding to the next step.
- **Acceptance Criteria:**
  1. Supported input types: Single-choice (Radio cards), Multi-select (Pill tags), Short Text, Detailed Long Text, Numeric Range / Scale (1-10), and Demographic selectors.
  2. Step transitions are disabled until all mandatory questions in the current step meet schema constraints.
  3. Validation errors appear inline with clear assistive messaging and zero layout shifting.

### US-04: Surveyor Campaign Management & Administration
- **As an** Admin / Surveyor,
- **I want** a secured administrative panel to create, toggle (activate/pause), and configure survey campaigns,
- **So that** I have full lifecycle control over our information gathering initiatives.
- **Acceptance Criteria:**
  1. Password-protected or token-authenticated dashboard accessible at `/admin`.
  2. Ability to define campaign metadata: title, description, slug, active status, and custom T&C text.
  3. Ability to input or edit declarative JSON survey schemas governing question blocks.

### US-05: Live Analytics & Structured Data Export
- **As an** Admin / Surveyor,
- **I want** to review incoming response metrics and download submissions in CSV and JSON formats,
- **So that** I can perform quantitative analysis and data ingestion in external analytical tooling.
- **Acceptance Criteria:**
  1. Dashboard displays aggregate metrics: Total Views, Total Starts, Total Completed, and Completion Rate.
  2. Filterable tabular view displaying individual submissions with timestamps and consent verification status.
  3. One-click CSV and JSON export endpoints streaming sanitized data with proper MIME types.

---

## 3. MoSCoW Prioritization Framework

| Priority | Feature / Requirement | Acceptance & Scope Description |
| :--- | :--- | :--- |
| **MUST HAVE** | Multi-Campaign Routing | Dynamic resolution of `/s/:slug` routes serving isolated survey configurations. |
| **MUST HAVE** | Multi-Step Wizard Flow | Smooth card-based questionnaire with progress bar, step navigation, and validation. |
| **MUST HAVE** | Mandatory T&C Consent Gate | Explicit modal + checkbox enforcement with immutable audit logging. |
| **MUST HAVE** | Diverse Question Types | Support for text, textarea, single-choice, multiple-choice, rating scale (1-10), and dropdowns. |
| **MUST HAVE** | Strict Schema Validation | Backend validation via Zod/TypeScript ensuring zero malformed payloads enter storage. |
| **MUST HAVE** | Persistent Response Vault | Relational or embedded transactional storage (SQLite/PostgreSQL) with relational foreign keys. |
| **MUST HAVE** | Admin Dashboard & Exporter | Authenticated management UI for viewing campaigns, response tables, and generating CSV/JSON. |
| **SHOULD HAVE** | Local Draft Recovery | Save progress in `localStorage`/`sessionStorage` so refreshing does not discard entered data. |
| **SHOULD HAVE** | Anti-Bot & Rate Limiting | IP-based submission rate limiting (max 10 submissions/minute) and honeypot field. |
| **SHOULD HAVE** | Visual Completion Analytics | Breakdown graphs for completion funnel and question-by-question answer distributions. |
| **COULD HAVE** | Campaign Theme Customization | Per-campaign primary accent colors and custom organization logo upload. |
| **COULD HAVE** | Webhook Dispatcher | HTTP POST webhook triggered upon survey submission to notify external endpoints. |
| **WON'T HAVE** | Visual Drag-and-Drop Canvas | No complex visual layout builder (declarative JSON schemas are used instead). |
| **WON'T HAVE** | Stealth / Fingerprint Scraping | Zero unauthorized background audio, video, canvas fingerprinting, or hidden tracking. |
| **WON'T HAVE** | Public Social Feeds | No public leaderboards, comment sections, or social feed integrations. |

---

## 4. Non-Functional Requirements & `/boost` Trade-Off Analysis

### 4.1 Latency & Performance
- **Target:** Sub-100ms UI step navigation transitions; sub-200ms P95 API response time for payload submission.
- **Architecture Trade-off:**
  - *Option A (Optimistic Asynchronous Background Sync):* UI marks survey as done instantly while syncing in background.
  - *Option B (Transactional Synchronous Handshake - Chosen):* UI displays loading state during submission, awaiting guaranteed 201 Created from server before showing completion screen.
  - *Justification:* In information-gathering and consent-driven workflows, data loss due to dropped network connections or background sync failures is unacceptable. Transactional confirmation guarantees respondent data and consent ledgering are written to disk.

### 4.2 Security & Compliance Hardening
- **Target:** Zero plaintext PII vulnerability, zero script injection vulnerability (OWASP Top 10 compliance).
- **Architecture Trade-off:**
  - *Defense In Depth:*
    - **Input Sanitization:** Dual-layer validation (client-side form guards + server-side Zod parsing).
    - **Consent Proof:** Store SHA-256 hash of the exact T&C version agreed to along with client headers and ISO timestamp.
    - **SQL Injection Prevention:** Parameterized queries via modern ORM / query builder (Drizzle OR Prisma).
    - **Rate Limiting:** Token-bucket rate limiter preventing automated bot spamming and survey denial-of-service.

### 4.3 Operational Cost & Scalability
- **Target:** Low operational overhead capable of hosting 100,000+ responses on budget or serverless infrastructure.
- **Architecture Trade-off:**
  - *Option A (Heavy Microservices + Kafka + Distributed NoSQL):* Excessive operational complexity and high idle hosting costs.
  - *Option B (Single Unified Next.js / Node.js Fullstack with SQLite/Postgres - Chosen):* Zero cold-start latency, singular deployment footprint, unified TypeScript types across client and backend, trivial backups via SQLite file snapshot or managed Postgres.

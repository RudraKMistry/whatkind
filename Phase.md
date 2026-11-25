# Implementation Phases & Milestones: Modular Multi-Survey Portal

## 1. Phased Execution Roadmap

### Phase 0: Workspace Scaffolding & Core Design Theme Foundation
- **Objectives:**
  - Initialize Next.js 14/15 App Router project structure with TypeScript strict mode.
  - Configure Tailwind CSS design tokens according to `Design.md` (Warm Humanist palette: `#FBF9F5`, `#1C1917`, `#D97706`, `#E7E2D8`).
  - Establish base typography, container layout shells, and global CSS variables.
  - Set up Prisma ORM client with initial schema models (`Campaign`, `Response`, `ConsentLog`, `AdminUser`).
- **Ends When:**
  - `pnpm dev` or `npm run dev` boots cleanly with zero console warnings.
  - The base layout renders the Warm Humanist aesthetic with proper font styles, background tokens, and responsive padding.
  - Prisma client generates successfully with `DATABASE_URL` configured.

---

### Phase 1: Declarative Schema Engine & Dynamic Wizard Components
- **Objectives:**
  - Implement core Zod validation schemas for all supported question types (`text`, `textarea`, `single_choice`, `multi_choice`, `rating_scale`, `demographic_select`).
  - Build the interactive `WizardContainer` with animated step progression, progress bar, and keyboard navigation.
  - Create the polymorphic `QuestionRenderer` with tactile radio cards, pills, and input controls adhering to the design tokens.
  - Implement client-side `sessionStorage` caching to prevent data loss across page refreshes.
- **Ends When:**
  - A mock survey campaign with multiple question types navigates seamlessly across all steps with immediate validation feedback.
  - Incomplete mandatory inputs prevent advancement with clear assistive error indicators.

---

### Phase 2: Mandatory Terms & Conditions Gate & Verifiable Consent Ledger
- **Objectives:**
  - Build `StepTermsConsentModal` requiring explicit user review of campaign-specific legal disclosures before the final submission.
  - Integrate mandatory checkbox gating that blocks submission until explicitly acknowledged.
  - Implement the backend submission route `/api/surveys/[campaignSlug]/submit`:
    - Full Zod payload verification.
    - Rate-limiting guard (max 10 submissions/minute/IP).
    - Cryptographic SHA-256 hash generation of the agreed Terms & Conditions content.
    - Transactional write across `Response` and `ConsentLog` tables.
- **Ends When:**
  - A respondent can complete the survey, accept the terms, and receive a verified submission receipt with transaction reference ID.
  - Any attempt to submit without consent verification fails with HTTP 400 Bad Request.

---

### Phase 3: Multi-Campaign Slug Routing & Persistence Verification
- **Objectives:**
  - Implement dynamic slug resolution at `/s/[campaignSlug]`.
  - Connect database persistence to serverless cloud PostgreSQL (Neon / Supabase) via Prisma.
  - Add graceful error boundaries for invalid, inactive, or expired campaign slugs.
  - Seed initial production-ready demographic and personal information gathering campaigns.
- **Ends When:**
  - Multiple distinct campaign URLs resolve their respective isolated question schemas and successfully save records to the cloud database.

---

### Phase 4: Surveyor Command Console & Data Export Engine
- **Objectives:**
  - Develop authenticated `/admin` portal with session security.
  - Build campaign management interface (create, activate, pause, edit T&C).
  - Implement live response metric counters (Total Starts, Completions, Completion Rate, Average Duration).
  - Build filterable tabular response explorer with detailed answer inspection.
  - Implement `/api/export` streaming responses into downloadable CSV and structured JSON files.
- **Ends When:**
  - An admin can log in, inspect incoming submissions with verified consent timestamps, and download an exported CSV dataset.

---

### Phase 5: Production Hardening, Audit Verification & Deployment
- **Objectives:**
  - Run full regression testing and security audit (XSS, SQL injection protection, rate limit stress test).
  - Configure production deployment pipelines (Vercel / Railway) with environment variable validation.
  - Confirm production database indexes and verify zero PII leaks.
- **Ends When:**
  - Live deployment is publicly accessible, passes automated end-to-end tests, and logs verified consent records under load.

---

## 2. Demo Risk Plan & Cut-Order
If project delivery constraints or aggressive time limits arise, features must be preserved or cut according to this strict hierarchy:

| Priority Rank | Module / Feature | Risk Action | Justification |
| :---: | :--- | :--- | :--- |
| **P0 (Keep)** | Dynamic Survey Intake & T&C Consent Gate | **NEVER CUT** | Core raison d'être of the project; compliance and data capture are non-negotiable. |
| **P0 (Keep)** | Persistent Response Storage & Validation | **NEVER CUT** | Submissions must reliably persist without corruption or data loss. |
| **P1 (Simplify)** | Admin Authentication | **SIMPLIFY** | Can fallback to a protected Bearer token / secure environment passphrase if full OAuth/session auth takes too long. |
| **P1 (Simplify)** | Advanced Analytics Charts | **SIMPLIFY** | Replace complex visual charts with high-contrast tabular KPI summary cards. |
| **P2 (Cut)** | Custom Logo & Accent Color Themes | **CUT** | Hardcode the curated Tactile Warm Humanist design system across all campaigns. |
| **P2 (Cut)** | External Webhook Notifications | **CUT** | Defer external webhook dispatching to a post-v1 backlog item. |

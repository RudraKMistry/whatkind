# AI Agent Operating Directives & Engineering Rules

> [!IMPORTANT]
> This document outlines the absolute engineering boundaries, code quality mandates, and behavioral contracts for all autonomous AI agents and subagents contributing to the Modular Multi-Survey Portal. Every guideline marked with 🔴 is strictly non-negotiable.

---

## 1. The Prime Directive
🔴 **Zero Data Loss & Absolute Consent Enforcement:** The primary goal of this platform is the reliable acquisition of demographic and personal intelligence coupled with verifiable legal consent. Under no circumstance may any code change allow a survey submission to persist without:
1. Validating all required questions against the active campaign schema.
2. Capturing an explicit, verified acceptance of the Terms & Conditions and Privacy Policy.
3. Cryptographically recording the exact T&C version and timestamp in the `ConsentLog` audit table.

---

## 2. File Ownership & Systemic Boundaries
🔴 **Strict Domain Isolation:** Agents must adhere to the ownership matrix specified in `Ar.md`:
- Frontend agents own components in `src/components/` and pages in `src/app/`. They MUST NOT mutate Prisma migration files or backend database models directly.
- Backend/Data agents own `src/app/api/`, `src/lib/`, and `prisma/`. They MUST NOT modify frontend UI layout styling without coordinating.
- Core schema definitions in `src/types/` and `src/lib/schema.ts` represent the system contracts. Changes require reciprocal updates across both client validators and server endpoints.

---

## 3. Contract Discipline & API Integrity
🔴 **Schema First, Never Guess:** 
- Every API endpoint accepting request bodies MUST parse and validate incoming data using a strict Zod schema before executing business logic or database operations.
- Dynamic question fields must conform to explicit types (`text`, `textarea`, `single_choice`, `multi_choice`, `rating_scale`, `demographic_select`). Arbitrary undeclared JSON structures are forbidden.
- Never return internal database error traces, raw SQL queries, or server stack traces to the public respondent client. All error responses must use standardized JSON error envelopes `{ "error": string, "code": string }`.

---

## 4. Scope Control & Feature Containment
🔴 **Guard Against Scope Creep:**
- Do not add unrequested visual canvas drag-and-drop builders, complex WYSIWYG editors, or social sharing feeds.
- Do not introduce extraneous third-party trackers, ad scripts, or external analytics SDKs that could compromise respondent privacy or breach consent guarantees.
- Always build against the MoSCoW priorities codified in `Pr.md`.

---

## 5. Secrets, Security & Production Safety
🔴 **Never Expose Sensitive Keys or Unsanitized Inputs:**
- Environment variables containing database connection strings (`DATABASE_URL`), session secrets, or admin credentials must strictly reside in `.env.local` / `.env` and be loaded via server-side utilities. Never leak secrets to client-facing bundles (no `NEXT_PUBLIC_` prefixes on secrets).
- All respondent-submitted text inputs must be sanitized to eliminate Cross-Site Scripting (XSS) and injection vectors.
- Parameterized database operations through Prisma are mandatory. Raw string-interpolated SQL (`$queryRawUnsafe`) is strictly prohibited.

---

## 6. Terminal Sandbox Compliance
🔴 **Sandbox-First Execution Hierarchy:**
- All terminal operations, builds, tests, and file processing must attempt execution in **Standard Sandbox Mode (`BypassSandbox: false`)** first.
- The only permissible exception on Windows is package installation/modification (e.g., `pnpm install`, `npm install`, `npx prisma generate` when external network resolution is required), which may use `BypassSandbox: true` if sandboxed execution blocks.
- Never elevate commands that do not strictly require network access. Always keep test suites, code generation, and linting fully sandboxed.

---

## 7. AI Output Integrity & Code Standards
🔴 **Complete Implementations, Zero Placeholders:**
- Never output placeholder comments such as `// TODO: implement later`, `// ... rest of code`, or truncated functions. Deliver complete, production-ready, runnable TypeScript code.
- Enforce strict TypeScript compilation. `any` types are disallowed unless explicitly justified with type narrowing.
- All React components must be accessible (proper ARIA labels, semantic HTML, keyboard navigable, responsive down to 320px screen width).

---

## 8. Continuous Documentation Mandate
🔴 **Live Tracking to Memory.md:**
- Every autonomous agent session that alters project state, finishes a phase task, adds/removes a dependency, modifies a UI layout, or changes a database schema MUST immediately append a structured entry to `Memory.md`.
- `Memory.md` serves as the single source of truth for ongoing system state, completed migrations, and operational history.

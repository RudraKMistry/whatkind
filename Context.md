# Project Context: Modular Multi-Survey Portal & Information Acquisition Platform

## 1. Vision & Core Value Proposition
The Modular Multi-Survey Portal is an enterprise-grade, multi-tenant survey execution and respondent data acquisition engine. Engineered to operate multiple independent survey campaigns simultaneously under dedicated URL slugs (e.g., `/s/:campaignSlug`), the system captures deep demographic, behavioral, and personal intelligence at scale. The platform ensures frictionless user progression, multi-step validation, and non-negotiable legal compliance by pairing every completed intake with an immutable, cryptographically timestamped Terms & Conditions consent record.

### One-Sentence Differentiator
*A high-throughput, multi-campaign demographic intelligence portal that orchestrates concurrent, isolated survey campaigns with dynamic multi-step question schemas, verifiable legal consent ledgering, and unified administrative analytics.*

---

## 2. Boundaries & Non-Goals (What We Are NOT Building)
To maintain operational velocity, security rigor, and architectural precision, the following areas are strictly out of scope:

- **NOT an Unbounded Drag-and-Drop WYSIWYG Form Builder:** We avoid the bloat of visual canvas builders (e.g., full visual layout styling by end users). Survey schemas are defined through structured, declarative configurations with type safety and schema validation.
- **NOT an Unconsented Tracking or Spyware Tool:** The platform operates strictly on transparent, explicit user submissions. We do not perform clandestine background audio/video recording, stealth device fingerprinting, or dark-pattern scraping. Every data point is entered knowingly and locked behind mandatory Terms & Conditions acceptance.
- **NOT a Public Social Community or Polling Feed:** Respondent submissions remain isolated within administrative response vaults; there are no public voting tickers, discussion forums, social shares, or public respondent directories.
- **NOT a Real-Time Ad-Exchange Broker:** Acquired intelligence is managed within private tenant datasets and is not directly brokered or auctioned across programmatic real-time bidding (RTB) networks.

---

## 3. Strict Domain Glossary
All architectural decisions, database models, API contracts, and engineering artifacts must consistently employ this nomenclature:

| Term | Definition |
| :--- | :--- |
| **Campaign** | An isolated survey initiative with a unique identifier, title, active date range, custom question schema, and dedicated public slug (`/s/:slug`). |
| **Respondent** | An individual accessing a campaign URL and voluntarily completing the questionnaire. |
| **Survey Schema** | A declarative, versioned JSON definition detailing question nodes, data types (text, single-choice, multi-choice, numeric, scale), validation bounds, and conditional branching rules. |
| **Consent Ledger** | An append-only audit log storing the exact Terms & Conditions hash, privacy policy version, ISO-8601 timestamp, and respondent confirmation acknowledgment. |
| **Response Vault** | The encrypted persistent storage layer housing completed, validated response payloads and campaign association keys. |
| **Surveyor / Admin** | An authenticated platform operator possessing credentials to provision campaigns, monitor response throughput, review individual answers, and export datasets. |
| **PII Payload** | Personally Identifiable Information fields (names, email addresses, phone numbers, demographic specifics) requiring encryption-at-rest and strict role-based access. |
| **Session State Machine** | The transient client/server execution state managing the respondent's step-by-step progress, draft persistence, and step validation. |

---

## 4. Definition of Done (DoD)
The platform is certified for production deployment only upon satisfying all the following baseline gates:

1. **Multi-Campaign Routing & Isolation:** Independent survey campaigns can be deployed with unique public routes, isolated schemas, and independent response data segregation.
2. **Dynamic Multi-Step Flow:** Mobile-optimized, accessible interface with zero layout shift, real-time input validation, step indicators, and sub-100ms transition latency.
3. **Verifiable Terms & Conditions Gate:** Hard barrier prohibiting survey completion without explicit, logged checkbox agreement to legal Terms & Conditions and Privacy Disclosures.
4. **Surveyor Command Dashboard:** Authenticated management interface showcasing real-time completion velocity, dropout rates, individual submission inspection, and filtered CSV/JSON dataset export.
5. **Resilience & Security Hardening:** Comprehensive input sanitization against XSS/injection, rate limiting on submission endpoints to prevent bot flooding, encrypted storage for PII, and automated test coverage exceeding 90% for validation and persistence pipelines.

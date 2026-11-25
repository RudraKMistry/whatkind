export const DEFAULT_TC_VERSION = "2.0.0";

export const DEFAULT_TERMS_AND_CONDITIONS = `
# MASTER TERMS OF USE, DATA PROCESSING DISCLOSURE, AND PRIVACY POLICY
**Effective Date:** November 25, 2026
**Document Version:** 2.0.0
**Instrument Classification:** Binding Electronic Participation Agreement & Informed Consent Disclosure

---

PLEASE READ THIS MASTER TERMS OF USE, DATA PROCESSING DISCLOSURE, AND PRIVACY POLICY ("AGREEMENT" OR "TERMS") CAREFULLY BEFORE ACCESSING, PARTICIPATING IN, OR SUBMITTING ANY INFORMATION THROUGH THIS SURVEY AND PSYCHOMETRIC ASSESSMENT PLATFORM ("PLATFORM"). BY CHECKING THE CONSENT CONFIRMATION BOX AND CLICKING THE SUBMISSION BUTTON, YOU ("PARTICIPANT," "RESPONDENT," OR "YOU") ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND VOLUNTARILY AGREED TO BE LEGALLY BOUND BY ALL PROVISIONS SET FORTH HEREIN. IF YOU DO NOT AGREE TO EVERY PROVISION OF THIS AGREEMENT, YOU MUST NOT SUBMIT ANY PROFILE INFORMATION, ASSESSMENT RESPONSES, OR PERSONAL DATA THROUGH THE PLATFORM.

---

## ARTICLE 1. DEFINITIONS AND INTERPRETATION
1.1 **Definitions.** For purposes of this Agreement, the following capitalized terms shall have the meanings set forth below:
- **"Administrator"** or **"Survey Operator"** means the authorized operator, researcher, or administrative controller managing the Platform, its campaigns, and its administrative console.
- **"Answer Logs"** means the structured, question-by-question record of every prompt presented to You during an Assessment, together with Your selected option identifier, human-readable choice text, Likert scale rating, or objective correctness indicator, persisted in serialized form.
- **"Assessment"** or **"Campaign"** means any survey, questionnaire, personality inventory, cognitive puzzle sequence, moral alignment matrix, behavioral index, or character-matching evaluation hosted on the Platform.
- **"Consent Audit Record"** means the immutable cryptographic log entry recorded in the Platform's audit table (\`ConsentLog\`) at the moment of submission, comprising the \`SHA-256\` checksum of this Agreement, the applicable document version, a one-way cryptographic hash of Your network IP address, Your browser User-Agent string, and the precise Coordinated Universal Time (UTC) timestamp of acceptance.
- **"Personal Data"** or **"Respondent Profile"** means any information relating to an identified or identifiable natural person submitted via the Platform's profile registration or pre-assessment intake flow, including Your full name, electronic mail address, date of birth, gender designation, optional biographical or contextual notes, and persistent profile token.
- **"Platform"** means the web application, user interfaces, scoring engines, application programming interfaces (APIs), and underlying database infrastructure operated at this domain.
- **"Psychometric Results"** means the computed trait percentages, archetype classifications, percentile estimates, visual topology charts, and explanatory narrative summaries generated from Your Assessment responses.

1.2 **Rules of Construction.** Section and article headings are inserted for convenience of reference only and shall not affect the interpretation of this Agreement. References to "including" mean "including without limitation." References to singular terms include the plural and vice versa where the context so requires.

---

## ARTICLE 2. SCOPE, ACCEPTANCE, AND ELECTRONIC CONTRACTING
2.1 **Scope of Application.** This Agreement governs all access to and use of the Platform, including browsing active Assessment campaigns, creating or updating a Respondent Profile, completing multi-step questionnaires, viewing computed Psychometric Results, and all associated data collection, storage, scoring, and administrative review activities.

2.2 **Binding Electronic Assent.** You expressly acknowledge and agree that checking the affirmative consent checkbox and activating the final submission control constitutes an electronic signature and a legally binding manifestation of assent under applicable electronic transactions laws, including the Electronic Signatures in Global and National Commerce Act (E-SIGN) and the Uniform Electronic Transactions Act (UETA), carrying the same legal force and effect as a handwritten signature.

2.3 **Condition Precedent to Submission.** The Platform enforces a strict technical and legal consent gate. No Assessment submission, Respondent Profile linkage, or Answer Log persistence is permitted unless and until You affirmatively accept the active version of these Terms and the Platform verifies the cryptographic integrity of the presented document checksum.

2.4 **Voluntary Participation.** Participation in any Assessment is strictly voluntary. You are under no obligation—contractual, statutory, or otherwise—to begin, continue, or complete any Assessment. You may abandon an Assessment at any time prior to final submission; however, once You affirmatively submit an Assessment, the resulting Answer Logs, Respondent Profile association, and Consent Audit Record are committed atomically to persistent storage.

---

## ARTICLE 3. ELIGIBILITY, AGE REQUIREMENT, AND CAPACITY TO CONSENT
3.1 **Minimum Age Requirement.** By participating in any Assessment or submitting Personal Data on the Platform, You represent and warrant that You are at least eighteen (18) years of age, or have reached the age of legal majority in Your jurisdiction of residence, whichever is greater, and possess full legal capacity to enter into a binding agreement.

3.2 **Prohibition on Minors' Data.** The Platform is not directed to, and does not knowingly solicit or collect Personal Data from, individuals under the age of eighteen (18). If the Survey Operator becomes aware that Personal Data has been submitted by an individual who does not meet the minimum age requirement, the Survey Operator reserves the right to immediately invalidate the submission and purge the associated records from active databases, subject to legal audit obligations.

3.3 **Truthfulness of Representations.** You represent and warrant that all demographic, biographical, and contact information provided in Your Respondent Profile is accurate, current, and truthful to the best of Your knowledge, and that You are submitting responses solely on Your own behalf and not by automated script, bot, or unauthorized proxy.

---

## ARTICLE 4. NATURE OF THE PLATFORM AND ASSESSMENT SERVICES
4.1 **Modular Multi-Assessment Architecture.** The Platform hosts multiple distinct psychometric, cognitive, behavioral, and character-matching Assessments, each governed by a declarative schema defining its step structure, question items, response formats, reverse-keying rules, and scoring dimensions.

4.2 **Immediate Computational Feedback.** Upon successful validation, consent verification, and persistent storage of Your submission, the Platform's scoring engine computes Your Psychometric Results in real time and presents them directly in Your browser session, together with interactive visualizations and plain-language explanatory summaries.

4.3 **No Guarantee of Availability.** While the Survey Operator endeavors to maintain continuous availability of active Campaigns, Campaigns may be paused, archived, modified, or retired at any time without prior notice. Closed or archived Campaigns do not accept new submissions, though previously recorded responses and Consent Audit Records remain preserved in accordance with this Agreement.

---

## ARTICLE 5. RESPONDENT PROFILE AND IDENTITY COLLECTION
5.1 **Mandatory Identity Intake.** Prior to submitting an Assessment, the Platform requires You to establish or confirm a Respondent Profile. The Respondent Profile captures and persists the following categories of identity and demographic information:
- **(a) Full Legal or Preferred Name:** Used to identify Your submission record within the administrative console and associate multiple Campaign completions with a single Respondent Profile.
- **(b) Electronic Mail Address:** Used as a primary contact identifier, administrative lookup key, and channel for responding to verified data rights or deletion inquiries.
- **(c) Date of Birth:** Collected to establish age eligibility, demographic cohort classification, and longitudinal research context.
- **(d) Gender Designation:** Collected as a standard demographic attribute for aggregated cohort analysis and administrative reporting.
- **(e) Optional Contextual Notes:** Any supplementary biographical, occupational, or contextual remarks that You voluntarily choose to enter into the optional notes field.

5.2 **Persistent Profile Token.** When You create or update a Respondent Profile, the Platform generates and assigns a unique client-side and server-persisted profile token (\`profileToken\`). This token enables seamless association between Your Respondent Profile and any subsequent Assessments You complete on the Platform, without requiring You to re-enter identical identity fields on every Campaign.

5.3 **Write-Only Public Profile Privacy.** To protect Your Personal Data from unauthorized enumeration or third-party scraping, public profile endpoints operate on a strict write-only basis. Other respondents cannot query, browse, or retrieve Your Respondent Profile, email address, birth date, or notes. Access to full Respondent Profiles is restricted exclusively to authenticated Administrators operating within the secured administrative console.

5.4 **Accuracy and Updates.** You may update Your Respondent Profile details prior to submitting an Assessment. Updating Your profile updates the canonical Respondent Profile record linked to Your \`profileToken\`, and subsequent exports or administrative views will reflect the updated profile metadata.

---

## ARTICLE 6. FULL QUESTION-BY-QUESTION RESPONSE LOGGING
6.1 **Comprehensive Answer Persistence.** Unlike anonymous aggregate-only polls, this Platform records and persists Your complete, granular responses for every question presented in an Assessment. Upon submission, the Platform constructs and stores both the raw answer payload and a structured question-by-question Answer Log (\`answerLogsJson\`).

6.2 **Contents of Question-by-Question Logs.** For each item in an Assessment, the recorded Answer Log may include:
- **(a)** The unique question identifier and full question prompt text;
- **(b)** The Assessment step or section from which the question originated;
- **(c)** The question type (such as five-point Likert agreement scale, single-choice dilemma, multiple-choice selection, cognitive puzzle, demographic selector, or open text response);
- **(d)** Your exact submitted value, selected option identifier, and corresponding human-readable label; and
- **(e)** For objective cognitive or deductive puzzle items, an indicator reflecting whether Your selected option matched the calibrated target answer.

6.3 **Administrative Inspection and Export.** You expressly acknowledge and consent that Your complete Question-by-Question Answer Logs, linked to Your Respondent Profile and submission reference identifier, are viewable by authorized Administrators in the Platform's response explorer and may be included in structured administrative data exports (including CSV and JSON formats) generated by the Survey Operator.

---

## ARTICLE 7. CRYPTOGRAPHIC CONSENT AUDIT AND VERIFICATION
7.1 **Immutable Audit Trail.** To maintain verifiable, tamper-evident proof that Your participation and data disclosure were knowingly and affirmatively consented to, the Platform executes an atomic database transaction upon submission that records a dedicated \`ConsentLog\` entry alongside Your \`Response\` record.

7.2 **Elements of the Consent Audit Record.** Each Consent Audit Record captures and permanently stores:
- **(a) Cryptographic Document Checksum (\`SHA-256\`):** A 64-character hexadecimal SHA-256 hash computed over the exact canonical text of these Terms presented to You at the time of submission. Any alteration of even a single character in the Terms alters the resulting checksum, guaranteeing that the exact text You accepted can be cryptographically proven.
- **(b) Document Version Identifier:** The semantic version number of this Agreement (\`tcVersion\`) active for the Campaign at the moment of submission.
- **(c) One-Way Hashed Network Address (\`ipHash\`):** A salted or one-way cryptographic hash derived from the network IP address from which Your submission originated, stored solely for anti-abuse rate limiting, duplicate/spam mitigation, and legal non-repudiation without retaining raw plaintext IP logs in the consent table.
- **(d) Browser User-Agent String:** Technical metadata identifying the browser and operating environment used to execute the electronic consent action.
- **(e) Coordinated Universal Time (UTC) Timestamp:** The exact server-recorded UTC date and time at which Your affirmative consent and submission were committed.

7.3 **Server-Side Checksum Enforcement.** Prior to persisting any submission, the Platform's server-side submission endpoint independently recomputes the SHA-256 checksum of the Campaign's active Terms and verifies that the checksum submitted by Your browser matches the authoritative server checksum. Submissions with mismatched, missing, or unverified checksums are automatically rejected.

---

## ARTICLE 8. PURPOSE AND LEGAL BASIS OF DATA PROCESSING
8.1 **Primary Processing Purposes.** The Survey Operator processes Your Respondent Profile, Assessment responses, and Consent Audit Records for the following legitimate, explicitly disclosed purposes:
- **(a) Psychometric Scoring and Immediate Feedback:** Calculating Your trait scores, percentile standings, archetype profiles, and character matches immediately upon submission;
- **(b) Research, Statistical, and Cohort Analysis:** Analyzing response distributions, psychometric reliability, item performance, and demographic correlations across participant cohorts;
- **(c) Platform Integrity and Security:** Enforcing rate limits, preventing automated spam or fraudulent submissions, validating schema compliance, and maintaining verifiable consent audit logs;
- **(d) Administrative Review and Reporting:** Enabling authorized Administrators to review individual submissions, verify consent records, and export structured datasets for authorized research or operational analysis.

8.2 **Legal Bases for Processing.** Where applicable data protection frameworks (such as the General Data Protection Regulation (GDPR), the UK GDPR, or comparable regional privacy statutes) apply, the processing of Your Personal Data and Assessment responses is grounded on:
- **(a) Your Explicit, Informed Consent:** Freely given, specific, informed, and unambiguous agreement indicated via the mandatory pre-submission consent gate;
- **(b) Performance of a Requested Service:** Computing and delivering the Psychometric Results You requested by completing the Assessment; and
- **(c) Legitimate Interests and Legal Compliance:** Maintaining cryptographic consent audit records, securing Platform infrastructure against abuse, and fulfilling statutory record-keeping obligations.

8.3 **No Automated Legal or Financial Decision-Making.** While the Platform uses automated mathematical algorithms to compute Psychometric Results for informational and entertainment/research purposes, the Platform does not use automated profiling to make decisions producing legal, employment, credit, insurance, housing, or similarly significant effects concerning You.

---

## ARTICLE 9. NON-CLINICAL, NON-DIAGNOSTIC, AND EDUCATIONAL DISCLAIMERS
9.1 **Informational and Research Purpose Only.** ALL ASSESSMENTS, TRAIT SCORES, COGNITIVE ESTIMATES, ARCHETYPE CLASSIFICATIONS, MORAL ALIGNMENT MAPPINGS, DARK TRIAD INDICES, AND CHARACTER MATCHES PROVIDED ON THIS PLATFORM ARE DESIGNED STRICTLY FOR EDUCATIONAL, INFORMATIONAL, SELF-REFLECTION, AND RESEARCH PURPOSES.

9.2 **Not Medical, Psychological, or Psychiatric Advice.** THE PLATFORM DOES NOT PROVIDE MEDICAL, CLINICAL, PSYCHOLOGICAL, PSYCHIATRIC, OR MENTAL HEALTH DIAGNOSIS, TREATMENT, THERAPY, OR PROFESSIONAL COUNSELING. NO SCORE, PERCENTILE, STANDARD ERROR BAND, OR NARRATIVE SUMMARY GENERATED BY THE PLATFORM CONSTITUTES A CLINICAL DIAGNOSIS OR A SUBSTITUTE FOR EVALUATION BY A LICENSED PHYSICIAN, CLINICAL PSYCHOLOGIST, PSYCHIATRIST, OR QUALIFIED MENTAL HEALTH PROFESSIONAL.

9.3 **Cognitive and Psychometric Limitations.** Automated online assessments are inherently constrained by self-report accuracy, environmental distractions, test-taking conditions, and abbreviated item banks. Cognitive scores (including estimated IQ and sub-domain scores) represent statistical estimates relative to calibrated item models and do not constitute an official, proctored, or clinically administered intelligence examination (such as a proctored WAIS or Stanford-Binet assessment) and cannot be used for academic placement, clinical disability determination, or Mensa qualification.

9.4 **Fictional and Archetypal Content.** Certain Campaigns incorporate fictional frameworks, literary archetypes, or role-playing taxonomies (including moral alignment grids and fictional character matches). Such classifications are creative, analytical metaphors and carry no clinical, moral, or legal judgment regarding Your character or worth.

---

## ARTICLE 10. INTELLECTUAL PROPERTY AND PROPRIETARY SCORING ALGORITHMS
10.1 **Ownership of Platform Materials.** All software code, user interface designs, visual chart engines (including custom SVG bell curves, radar topologies, pentagrams, Cartesian grids, delta polygons, and dual-layer character charts), question wording, schema structures, scoring formulas, and explanatory text on the Platform are the proprietary intellectual property of the Survey Operator or its licensors and are protected by applicable copyright, trademark, trade secret, and intellectual property laws.

10.2 **Limited Personal License.** Subject to Your compliance with this Agreement, the Survey Operator grants You a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to access and use the Platform solely for Your personal, non-commercial participation in active Assessments and viewing of Your own Psychometric Results.

10.3 **Restrictions on Reverse Engineering and Scraping.** You shall not, and shall not permit any third party to: (a) scrape, crawl, harvest, or systematically extract Assessment questions, answer keys, or scoring weights; (b) reverse engineer, decompile, or attempt to derive the source code or proprietary calibration formulas of the scoring engine; (c) reproduce, republish, distribute, or commercially exploit any Platform content without prior written authorization; or (d) frame or mirror any portion of the Platform without express consent.

10.4 **License to Submitted Responses.** By submitting Assessment responses and optional notes, You grant the Survey Operator a perpetual, worldwide, royalty-free right to store, process, analyze, aggregate, and export Your submitted data solely in accordance with the privacy, non-disclosure, and security commitments set forth in this Agreement.

---

## ARTICLE 11. ACCEPTABLE USE AND PROHIBITED CONDUCT
11.1 **Prohibited Activities.** In connection with Your use of the Platform, You agree that You will NOT:
- **(a)** Submit false, misleading, defamatory, unlawful, or maliciously crafted text inputs, scripts, or payloads (including Cross-Site Scripting (XSS) or SQL injection attempts);
- **(b)** Use automated bots, headless browsers, scripts, or stress-testing tools to flood the Platform, bypass rate limits (currently enforced at strict per-IP submission thresholds), or distort Campaign datasets;
- **(c)** Attempt to gain unauthorized access to the administrative console, administrative APIs, database instances, environment secrets, or another participant's Respondent Profile or submission records;
- **(d)** Interfere with, disrupt, or degrade the integrity, security, or performance of the Platform's servers, database connections, or third-party cloud infrastructure; or
- **(e)** Impersonate any other person or entity or submit Personal Data belonging to another individual without their lawful authorization.

11.2 **Enforcement and Remedies.** The Survey Operator reserves the right to block IP addresses, throttle requests, invalidate fraudulent or automated submissions, and pursue all available civil or criminal remedies against any individual or entity violating this Article 11.

---

## ARTICLE 12. DATA SECURITY, INFRASTRUCTURE, AND ENCRYPTED PERSISTENCE
12.1 **Technical Safeguards.** The Survey Operator implements industry-standard administrative, technical, and physical safeguards designed to protect Your Personal Data and Assessment responses against unauthorized access, accidental loss, alteration, or disclosure. These safeguards include:
- **(a) Encrypted Cloud Persistence:** Respondent Profiles, Responses, Answer Logs, and Consent Audit Records are persisted in a managed, encrypted Serverless Cloud PostgreSQL database (Neon PostgreSQL) utilizing Transport Layer Security (TLS/SSL) for data in transit and encryption at rest.
- **(b) Parameterized Database Operations:** All database reads and writes are executed exclusively through parameterized Object-Relational Mapping (Prisma ORM) queries to prevent SQL injection vulnerabilities.
- **(c) Input Sanitization and Schema Validation:** Every incoming API payload is strictly validated against declarative Zod schemas prior to processing or persistence, and all user-supplied text is sanitized to neutralize injection vectors.
- **(d) Zero Secret Background Surveillance:** The Platform does NOT record background audio, webcam video, keystroke biometrics, GPS coordinates, or hidden device fingerprinting telemetry outside the explicit fields You submit and the standard HTTP connection headers hashed for consent auditing.

12.2 **Administrative Access Controls.** Access to the administrative console and data export endpoints is gated behind authenticated server-side sessions and restricted strictly to authorized Administrators.

12.3 **No Absolute Security Guarantee.** Notwithstanding the foregoing safeguards, no method of electronic transmission over the Internet or electronic storage architecture is 100% impenetrable. You acknowledge that You submit information over public networks at Your own risk, and while the Survey Operator maintains rigorous security controls, absolute immunity from sophisticated cyberattacks cannot be warranted.

---

## ARTICLE 13. DATA RETENTION AND ARCHIVAL POLICY
13.1 **Active Retention Period.** Your Respondent Profile, Assessment responses, Answer Logs, and Consent Audit Records are retained for as long as necessary to fulfill the research, statistical, operational, and audit verification purposes described in this Agreement, unless a longer retention period is required or permitted by applicable law.

13.2 **Campaign Archival.** When an Assessment Campaign transitions to an inactive or closed state, public access to submit new responses is disabled, while historical responses and associated \`ConsentLog\` records remain securely archived in the database for longitudinal integrity and compliance verification.

13.3 **Audit Log Immutability.** Because the \`ConsentLog\` table serves as a legal non-repudiation ledger proving that collected data was obtained with verifiable informed consent, Consent Audit Records may be retained in anonymized or reference-linked form even where underlying profile details are modified or purged pursuant to a verified deletion request, to the extent permitted by law.

---

## ARTICLE 14. RESPONDENT RIGHTS AND DATA REQUESTS
14.1 **Your Privacy Rights.** Depending on Your jurisdiction, You may have certain statutory rights regarding Your Personal Data, including the right to:
- **(a) Right of Access:** Request confirmation of whether Personal Data concerning You is being processed and obtain a summary of Your stored Respondent Profile and Assessment submissions;
- **(b) Right to Rectification:** Request correction of inaccurate or incomplete Personal Data in Your Respondent Profile;
- **(c) Right to Erasure ("Right to be Forgotten"):** Request deletion of Your Respondent Profile and identifiable Assessment records, subject to overriding legal, security, or consent-audit retention obligations;
- **(d) Right to Restriction or Objection:** Request that the Survey Operator restrict or cease processing of Your Personal Data under specific statutory circumstances; and
- **(e) Right to Withdraw Consent:** Withdraw Your consent for future data processing at any time, understanding that withdrawal does not affect the lawfulness of processing based on consent prior to its withdrawal.

14.2 **Submitting a Verified Request.** To exercise any of these rights, You may contact the Survey Operator or Administrator and provide Your unique submission Reference ID (e.g., \`RESP-XXXXXX\`) and the email address associated with Your Respondent Profile so that Your identity and record ownership can be reasonably verified prior to fulfilling the request.

---

## ARTICLE 15. THIRD-PARTY NON-DISCLOSURE AND NO-SALE COVENANT
15.1 **Strict Prohibition on Data Sales.** THE SURVEY OPERATOR DOES NOT SELL, RENT, LEASE, OR TRADE YOUR PERSONAL DATA, RESPONDENT PROFILE, OR ASSESSMENT RESPONSES TO THIRD-PARTY DATA BROKERS, ADVERTISING NETWORKS, MARKETING AGENCIES, OR COMMERCIAL PROFILERS.

15.2 **No Third-Party Ad Trackers.** The Platform does not embed third-party behavioral advertising pixels, cross-site tracking cookies, or external commercial analytics SDKs that monetize or leak Your Assessment behavior to outside parties.

15.3 **Authorized Infrastructure Subprocessors.** Your data is processed solely on essential hosting and database infrastructure providers (including Vercel for application hosting and Neon for encrypted PostgreSQL persistence) acting as technical infrastructure providers bound by strict confidentiality and security obligations.

15.4 **Legal Compulsion Exception.** The Survey Operator may disclose stored records if strictly required to do so by a valid subpoena, court order, or binding governmental mandate, or when necessary in good faith to protect the safety, rights, or property of the Survey Operator, Platform participants, or the public.

---

## ARTICLE 16. DISCLAIMER OF WARRANTIES
16.1 **AS-IS AND AS-AVAILABLE BASIS.** TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, THE PLATFORM, ALL ASSESSMENTS, SCORING ALGORITHMS, VISUALIZATIONS, AND PSYCHOMETRIC RESULTS ARE PROVIDED ON AN "AS-IS" AND "AS-AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE.

16.2 **SPECIFIC DISCLAIMERS.** THE SURVEY OPERATOR EXPRESSLY DISCLAIMS ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, NON-INFRINGEMENT, ACCURACY, COMPLETENESS, AND UNINTERRUPTED OR ERROR-FREE OPERATION. THE SURVEY OPERATOR DOES NOT WARRANT THAT PSYCHOMETRIC RESULTS WILL MEET YOUR EXPECTATIONS, REFLECT CLINICAL TRUTH, OR BE FREE FROM STATISTICAL MARGIN OF ERROR.

---

## ARTICLE 17. LIMITATION OF LIABILITY
17.1 **EXCLUSION OF CONSEQUENTIAL DAMAGES.** TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL THE SURVEY OPERATOR, ITS ADMINISTRATORS, RESEARCHERS, CONTRIBUTORS, AFFILIATES, OR INFRASTRUCTURE PROVIDERS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, LOSS OF DATA, EMOTIONAL DISTRESS, REPUTATIONAL HARM, OR PERSONAL DECISION-MAKING OUTCOMES ARISING OUT OF OR IN CONNECTION WITH YOUR ACCESS TO OR USE OF THE PLATFORM OR RELIANCE ON ANY PSYCHOMETRIC RESULTS, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.

17.2 **AGGREGATE LIABILITY CAP.** TO THE EXTENT PERMITTED BY LAW, THE TOTAL AGGREGATE LIABILITY OF THE SURVEY OPERATOR FOR ALL CLAIMS ARISING OUT OF OR RELATING TO THIS AGREEMENT OR YOUR USE OF THE PLATFORM SHALL NOT EXCEED THE GREATER OF: (A) THE AMOUNT ACTUALLY PAID BY YOU TO ACCESS THE PLATFORM IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM (WHICH IS ZERO DOLLARS ($0.00) FOR FREE PUBLIC ASSESSMENTS), OR (B) ONE HUNDRED U.S. DOLLARS ($100.00).

17.3 **BASIS OF THE BARGAIN.** YOU ACKNOWLEDGE THAT THE PLATFORM IS PROVIDED FREE OF CHARGE FOR EDUCATIONAL AND RESEARCH PARTICIPATION AND THAT THE LIMITATIONS OF LIABILITY SET FORTH IN THIS ARTICLE 17 FORM AN ESSENTIAL BASIS OF THE BARGAIN BETWEEN YOU AND THE SURVEY OPERATOR.

---

## ARTICLE 18. INDEMNIFICATION
18.1 **Participant Indemnity.** You agree to defend, indemnify, and hold harmless the Survey Operator, its Administrators, researchers, affiliates, and service providers from and against any and all claims, liabilities, damages, losses, costs, and expenses (including reasonable attorneys' fees) arising out of or relating to: (a) Your breach of any representation, warranty, or covenant in this Agreement; (b) Your violation of any applicable law or third-party right; (c) any fraudulent, malicious, or automated payload submitted by You; or (d) Your unauthorized use or redistribution of Platform content.

---

## ARTICLE 19. MODIFICATIONS TO TERMS AND VERSIONING
19.1 **Versioned Amendments.** The Survey Operator reserves the right to revise, update, or replace this Agreement at any time. Whenever material changes are made, the Platform increments the semantic Document Version (\`tcVersion\`) and computes a new canonical SHA-256 checksum for the updated text.

19.2 **Prospective Effect Only.** Any modification to this Agreement applies strictly prospectively to Assessments submitted after the effective date of the revised version. Your prior Consent Audit Records remain cryptographically bound to the exact version and SHA-256 checksum in effect at the time of Your original submission.

---

## ARTICLE 20. GOVERNING LAW, DISPUTE RESOLUTION, AND ENTIRE AGREEMENT
20.1 **Governing Law.** This Agreement and any dispute or claim arising out of or in connection with it or its subject matter shall be governed by and construed in accordance with applicable federal laws and the laws of the jurisdiction in which the Survey Operator is established, without giving effect to any choice or conflict of law provision or rule.

20.2 **Informal Resolution First.** Before initiating any formal legal proceeding or arbitration, You agree to first contact the Survey Operator with a written description of Your concern and Your submission Reference ID, allowing thirty (30) days for good-faith informal resolution.

20.3 **Severability.** If any provision of this Agreement is held by a court of competent jurisdiction to be invalid, illegal, or unenforceable, such provision shall be modified to the minimum extent necessary to make it valid and enforceable, or severed if modification is impossible, and the remaining provisions of this Agreement shall continue in full force and effect.

20.4 **No Waiver.** No failure or delay by the Survey Operator in exercising any right or remedy under this Agreement shall operate as a waiver thereof, nor shall any single or partial exercise of any right or remedy preclude any other or further exercise thereof.

20.5 **Survival.** Articles 1, 6, 7, 9, 10, 12, 13, 15, 16, 17, 18, and 20 shall survive any termination of Your access to the Platform or completion of an Assessment.

20.6 **Entire Agreement.** This Agreement, together with the specific Campaign instructions presented on the Platform, constitutes the entire, integrated agreement between You and the Survey Operator regarding Your participation in Assessments and supersedes all prior or contemporaneous understandings, communications, or representations, whether oral or written.

---

**FINAL ACKNOWLEDGMENT:** BY CHECKING THE CONSENT BOX AND CLICKING "AGREE & SEE MY RESULTS," YOU CONFIRM THAT YOU ARE AT LEAST 18 YEARS OF AGE, HAVE READ ALL TWENTY (20) ARTICLES OF THIS AGREEMENT, AND FREELY CONSENT TO THE COLLECTION, FULL QUESTION-BY-QUESTION LOGGING, CRYPTOGRAPHIC CONSENT AUDITING, AND SCORING OF YOUR PROFILE AND RESPONSES AS SET FORTH ABOVE.
`.trim();

/**
 * Precomputed canonical SHA-256 checksum for the default terms and conditions.
 * Client-safe with zero Node.js 'crypto' dependencies.
 */
export const CANONICAL_TC_CHECKSUM = "325883ac3bb7f9346e3393f1b3f7fb64391de77e13228d1c297dfa8bd391284a";

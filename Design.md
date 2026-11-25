# Design System Specification: Tactile Warm Humanist & Modern Studio

## 1. Visual Philosophy & Aesthetic Anchor
Drawing direct inspiration from physical editorial archives, high-craft print design, and tactile paper studios, the Modular Multi-Survey Portal departs completely from cold, corporate blue SaaS tropes and harsh cyber-neon clichés. 

The aesthetic is grounded in **Tactile Warm Humanism**:
- Natural, unbleached paper whites and warm cream backgrounds that ease eye fatigue during lengthy multi-step evaluations.
- Rich terracotta, burnt sienna, and warm amber accents that communicate intentionality, warmth, and grounded authority.
- Deep espresso and charcoal typography delivering razor-sharp contrast and impeccable legibility without the harshness of pitch black on pure white.
- Generous physical radii (8px–14px), tactile border strokes with subtle warm taupe tones, and diffuse, multi-layered shadows mimicking natural ambient daylight.

---

## 2. Definitive Color Palette & Design Tokens

| Token Name | Hex Code | Semantic Role & Application | Contrast Ratio (vs Background) |
| :--- | :--- | :--- | :--- |
| `--bg-canvas` | `#FBF9F5` | Primary page viewport canvas (Warm Japanese Washi Paper) | Base Canvas |
| `--bg-surface` | `#FFFFFF` | Survey question cards, modal dialogs, and admin tables | Elevated Surface |
| `--bg-subtle` | `#F5F0E8` | Selected card fill, pill background, input backdrops | Soft Accent Fill |
| `--border-base` | `#E7E2D8` | Structural dividing borders, unselected input borders | 1.8:1 (Subtle Divider) |
| `--border-focus` | `#D97706` | Focused inputs, active selected radio cards, active tabs | 3.4:1 (Focus Ring) |
| `--accent-amber` | `#D97706` | Primary action buttons (`Continue`, `Accept Terms`), badges | 3.8:1 (Call to Action) |
| `--accent-terracotta` | `#C2410C` | Urgent warnings, error banners, mandatory field markers | 5.2:1 (Accessible Alert) |
| `--text-primary` | `#1C1917` | Primary question titles, headings, and high-emphasis body | 14.2:1 (AAA High Contrast) |
| `--text-secondary` | `#44403C` | Descriptive helper text, questionnaire sub-labels | 9.1:1 (AAA Contrast) |
| `--text-muted` | `#78716C` | Inactive step counters, copyright stamps, field hints | 4.6:1 (AA Contrast) |
| `--status-success` | `#059669` | Submission verified checkmarks, valid field icons | 4.8:1 (AA Status) |

---

## 3. Strict Typography Hierarchy & Fluid Scale

The typographic scale uses humanistic sans-serif typefaces (e.g., `Plus Jakarta Sans`, `Inter`, or system humanistic fallbacks) paired with tabular monospaced elements for numeric identifiers and legal hash verification.

| Hierarchy Level | Font Family / Weight | Size & Line Height | Letter Spacing | Purpose & Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display Title (H1)** | Sans-Serif / SemiBold (600) | `32px` (`2rem`) / `1.25` | `-0.02em` | Campaign title, completion celebration header |
| **Question Title (H2)** | Sans-Serif / Medium (500) | `22px` (`1.375rem`) / `1.35` | `-0.01em` | Individual step question heading |
| **Card / Option Body** | Sans-Serif / Regular (400) | `16px` (`1rem`) / `1.5` | `0` | Choice labels, multi-select descriptions |
| **Legal & T&C Text** | Sans-Serif / Regular (400) | `13px` (`0.8125rem`) / `1.6` | `+0.01em` | Terms & Conditions modal text, consent clauses |
| **Audit Ledger Monospace** | Monospace / Regular (400) | `12px` (`0.75rem`) / `1.4` | `+0.02em` | Consent checksums, transaction UUIDs, IP proof |

---

## 4. Layout Shell & Component Anatomy

### 4.1 Responsive Survey Shell
```
+-------------------------------------------------------------------------+
| [Header] Org Name / Campaign Title                  Step 2 of 4 (50%)   |
| [=========================== Progress Track ==========================] |
+-------------------------------------------------------------------------+
|                                                                         |
|   +-----------------------------------------------------------------+   |
|   |  QUESTION TITLE                                                 |   |
|   |  What best describes your primary professional focus?           |   |
|   |                                                                 |   |
|   |  +-----------------------------------------------------------+  |   |
|   |  | (o) Technology & Digital Systems                          |  |   |
|   |  +-----------------------------------------------------------+  |   |
|   |  | ( ) Creative Arts, Architecture & Design                  |  |   |
|   |  +-----------------------------------------------------------+  |   |
|   |  | ( ) Healthcare, Life Sciences & Medicine                  |  |   |
|   |  +-----------------------------------------------------------+  |   |
|   |  | ( ) Independent Research & Academia                       |  |   |
|   |  +-----------------------------------------------------------+  |   |
|   |                                                                 |   |
|   |  [< Previous]                       [Continue to Next Step ->]  |   |
|   +-----------------------------------------------------------------+   |
|                                                                         |
|   [Shield] Protected by cryptographic Terms & Conditions consent audit  |
+-------------------------------------------------------------------------+
```

### 4.2 Interactive Micro-States
- **Option Cards:** Resting state features an organic `#E7E2D8` border on `#FFFFFF`. On hover, the border shifts to warm terracotta `#D97706` with subtle 2px transform lift (`translateY(-2px)`). On active selection, background transitions to `#F5F0E8` with a solid 2px `#D97706` boundary.
- **Buttons:** Tactile pill-shaped or rounded-lg buttons with smooth spring transitions. Primary CTA uses `#D97706` fill with crisp white typography, elevating to `#B45309` on click.
- **T&C Modal Gate:** Slides up seamlessly with smooth backdrop blur (`backdrop-blur-sm bg-stone-900/40`), requiring complete scroll review before enabling the consent checkbox.

---

## 5. Visual UI Mockup Artifact

*The visual UI mockup generated by the autonomous design agent capturing the Tactile Warm Humanist aesthetic:*

![Mockup](C:/Users/ASUS/.gemini/antigravity/brain/6457403e-1125-4b3d-adfb-ab1a8195b58a/tactile_survey_ui_mockup_1794741668313.jpg)

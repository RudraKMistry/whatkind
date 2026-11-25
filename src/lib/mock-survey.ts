import type { SurveySchemaDefinition } from "../types/survey";

export const DEMO_SURVEY_SCHEMA: SurveySchemaDefinition = {
  version: "1.0.0",
  title: "Everyday Background & Work Survey 2026",
  description:
    "A short survey about your background, your work, and your thoughts on technology. Everything you share is protected under clear privacy rules that you review before submitting.",
  estimatedMinutes: 3,
  steps: [
    {
      id: "step_identity",
      title: "About You & Where You Live",
      description: "Basic background details so we can group answers by age and region.",
      questions: [
        {
          id: "full_name",
          type: "text",
          title: "Full Name",
          description: "Only used to confirm your identity and link it to your permission record.",
          required: true,
          placeholder: "e.g., Jane Doe",
        },
        {
          id: "email_address",
          type: "text",
          title: "Email Address",
          description: "We will send your confirmation receipt and reference code here.",
          required: true,
          placeholder: "jane.doe@example.com",
        },
        {
          id: "age_bracket",
          type: "demographic_select",
          title: "Age Group",
          required: true,
          options: [
            { id: "18-24", label: "18 – 24 years old" },
            { id: "25-34", label: "25 – 34 years old" },
            { id: "35-44", label: "35 – 44 years old" },
            { id: "45-54", label: "45 – 54 years old" },
            { id: "55-64", label: "55 – 64 years old" },
            { id: "65+", label: "65 years or older" },
          ],
        },
        {
          id: "geographic_region",
          type: "demographic_select",
          title: "Region Where You Live",
          required: true,
          options: [
            { id: "na", label: "North America (US & Canada)" },
            { id: "weu", label: "Western Europe" },
            { id: "eeu", label: "Central & Eastern Europe" },
            { id: "apac", label: "Asia-Pacific" },
            { id: "latam", label: "Latin America & Caribbean" },
            { id: "mea", label: "Middle East & Africa" },
            { id: "other", label: "Other region not listed" },
          ],
        },
      ],
    },
    {
      id: "step_professional",
      title: "Your Work & Experience",
      description: "Pick your main line of work and how long you have been doing it.",
      questions: [
        {
          id: "industry_sector",
          type: "single_choice",
          title: "Which area best matches your main job or field of work?",
          description: "Pick the group that fits most of what you do day to day.",
          required: true,
          options: [
            {
              id: "tech",
              label: "Technology & Computers",
              description: "Building software, running servers or cloud systems, AI, and online security.",
            },
            {
              id: "creative",
              label: "Design, Media & Creative Work",
              description: "App and website design, art, video, branding, and product design.",
            },
            {
              id: "healthcare",
              label: "Healthcare, Biology & Medicine",
              description: "Medical care, lab testing, health research, and making medicines.",
            },
            {
              id: "research",
              label: "Teaching & University Research",
              description: "College teaching, science studies, social research, and school programs.",
            },
            {
              id: "finance",
              label: "Money, Law & Business Planning",
              description: "Investing, tracking money, business rules, and legal work.",
            },
          ],
        },
        {
          id: "experience_bracket",
          type: "single_choice",
          title: "Years of Work Experience",
          required: true,
          options: [
            { id: "exp_0_2", label: "Just starting out (0 – 2 years)" },
            { id: "exp_3_5", label: "Mid-level experience (3 – 5 years)" },
            { id: "exp_6_10", label: "Experienced specialist (6 – 10 years)" },
            { id: "exp_10_plus", label: "Senior leader or manager (10+ years)" },
          ],
        },
      ],
    },
    {
      id: "step_habits",
      title: "Daily Tools & Data Privacy",
      description: "Tell us which tools you use and how much clear data rules matter to you.",
      questions: [
        {
          id: "active_tooling",
          type: "multi_choice",
          title: "Which kinds of tools do you use every week? (Pick all that apply)",
          description: "Helps us see how different tools connect to how people get work done.",
          required: true,
          options: [
            { id: "cloud_collab", label: "Online Office & Team Tools (Google Workspace, Microsoft 365)" },
            { id: "dev_terminal", label: "Coding & Developer Tools (VS Code, Neovim, Git, Docker)" },
            { id: "data_analytics", label: "Data & Chart Tools (Tableau, SQL, Pandas, Snowflake)" },
            { id: "design_suites", label: "Design & Art Programs (Figma, Blender, Adobe)" },
            { id: "ai_assistants", label: "AI Helpers & Chatbots (Antigravity, Claude, ChatGPT)" },
          ],
        },
        {
          id: "consent_importance",
          type: "rating_scale",
          title: "How important is clear permission tracking and data control at your workplace?",
          required: true,
          minScale: 1,
          maxScale: 10,
          minScaleLabel: "1 — Not very important",
          maxScaleLabel: "10 — Must-have rule",
        },
      ],
    },
    {
      id: "step_perspectives",
      title: "Your Thoughts on What Is Changing",
      description: "Share your own view on how your line of work is changing.",
      questions: [
        {
          id: "sector_insights",
          type: "textarea",
          title: "What is the biggest change happening in your field over the next 2 years?",
          description: "Optional: share any thoughts or examples in your own words.",
          required: false,
          placeholder: "Write about new tools, job changes, rules, or shifts you see happening...",
        },
      ],
    },
  ],
};

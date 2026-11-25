import Link from "next/link";
import { db } from "@/lib/db";
import { WizardContainer } from "@/components/survey/WizardContainer";
import { ProfileHeaderButton } from "@/components/profile/ProfileHeaderButton";
import { SurveySchemaDefinition } from "@/types/survey";
import { computeTermsChecksum } from "@/lib/terms-server";
import { DEMO_SURVEY_SCHEMA } from "@/lib/mock-survey";
import { ArrowLeft, AlertCircle, Archive, ArrowRight, ShieldCheck, Compass } from "lucide-react";

interface SurveyPageProps {
  params: {
    campaignSlug: string;
  };
}

export const dynamic = "force-dynamic";

export default async function SurveyPage({ params }: SurveyPageProps) {
  const { campaignSlug } = params;

  // Resolve slug alias (e.g. legacy demo-demographics resolves to demographics-2026)
  const resolvedSlug =
    campaignSlug === "demo-demographics" ? "demographics-2026" : campaignSlug;

  // 1. Resolve Campaign Record from Persistent Storage
  const campaign = await db.campaign.findUnique({
    where: { slug: resolvedSlug },
  });

  // 2. Boundary: Campaign Not Found (404 Screen)
  if (!campaign) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col justify-center items-center px-4 py-16">
        <div className="w-full max-w-lg rounded-tactile border border-border bg-surface p-8 sm:p-10 shadow-warm-xl text-center space-y-6">
          <div className="mx-auto h-14 w-14 rounded-full bg-terracotta-soft border border-terracotta/30 flex items-center justify-center text-terracotta shadow-warm-sm">
            <AlertCircle className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <span className="font-mono text-xs uppercase tracking-wider text-charcoal-500 font-semibold">
              Error 404 • Page Not Found
            </span>
            <h1 className="text-2xl font-semibold text-charcoal-900 tracking-tight font-sans">
              Quiz Not Found
            </h1>
            <p className="text-sm text-charcoal-700 leading-relaxed">
              We could not find an active quiz at{" "}
              <code className="font-mono bg-canvas-subtle px-1.5 py-0.5 rounded border border-border text-xs text-charcoal-900">
                /s/{campaignSlug}
              </code>
              . This quiz may have ended, or the web address may have a typo.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-sm font-medium shadow-warm-md transition-colors"
            >
              <Compass className="h-4 w-4" />
              See Active Quizzes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. Boundary: Inactive / Closed Campaign Screen
  if (!campaign.isActive) {
    return (
      <div className="min-h-screen bg-canvas flex flex-col justify-center items-center px-4 py-16">
        <div className="w-full max-w-lg rounded-tactile border border-border bg-surface p-8 sm:p-10 shadow-warm-xl text-center space-y-6">
          <div className="mx-auto h-14 w-14 rounded-full bg-primary-soft border border-primary/30 flex items-center justify-center text-primary shadow-warm-sm">
            <Archive className="h-7 w-7" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-canvas-subtle border border-border text-xs font-medium text-charcoal-700">
              <span className="h-2 w-2 rounded-full bg-charcoal-500" />
              Quiz Closed
            </div>
            <h1 className="text-2xl font-semibold text-charcoal-900 tracking-tight font-sans">
              {campaign.title}
            </h1>
            <p className="text-sm text-charcoal-700 leading-relaxed">
              This quiz is now closed and no longer takes new answers. All past answers and privacy records are safely stored.
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-surface border border-border hover:bg-canvas-subtle text-charcoal-900 text-sm font-medium shadow-warm-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. Active Campaign: Parse Declarative Schema & Render Wizard
  let schema: SurveySchemaDefinition;
  try {
    const parsed = JSON.parse(campaign.schemaJson);
    if (parsed && Array.isArray(parsed.steps) && parsed.steps.length > 0) {
      schema = parsed;
    } else {
      schema = DEMO_SURVEY_SCHEMA;
    }
  } catch (err) {
    console.warn("Schema parse fallback to demo schema for campaign", campaign.slug);
    schema = DEMO_SURVEY_SCHEMA;
  }

  return (
    <div className="min-h-screen bg-canvas py-10 px-4 sm:px-6 lg:px-8">
      {/* Top Navigation & Status Bar */}
      <header className="max-w-2xl mx-auto mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-charcoal-700 hover:text-charcoal-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Home
        </Link>
        <div className="flex items-center gap-2 text-xs font-mono text-charcoal-500">
          <ProfileHeaderButton />
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-canvas-subtle border border-border">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            Open Now
          </span>
          <span className="bg-canvas-subtle border border-border px-2 py-0.5 rounded hidden sm:inline">
            /{campaignSlug}
          </span>
        </div>
      </header>

      {/* Dynamic Survey Wizard Container */}
      <WizardContainer
        campaignSlug={resolvedSlug}
        schema={schema}
        tcVersion={campaign.tcVersion}
        tcContent={campaign.tcContent}
        tcChecksum={computeTermsChecksum(campaign.tcContent)}
      />
    </div>
  );
}

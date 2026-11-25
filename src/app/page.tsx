import Link from "next/link";
import { db } from "@/lib/db";
import { ProfileHeaderButton } from "@/components/profile/ProfileHeaderButton";
import {
  ArrowRight,
  ShieldCheck,
  Brain,
  Sparkles,
  Clock,
  BarChart3,
  Award,
  Scale,
  Zap,
  ShieldAlert,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Query all active campaigns from the database
  const activeCampaigns = await db.campaign.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { responses: true },
      },
    },
  });

  const getCategoryBadge = (category?: string, slug?: string) => {
    switch (category) {
      case "personality":
        return {
          label: "Personality (Big Five)",
          color: "bg-amber-100 text-amber-800 border-amber-300",
          icon: Sparkles,
        };
      case "cognitive":
        return {
          label: "Thinking & Logic (IQ)",
          color: "bg-blue-100 text-blue-800 border-blue-300",
          icon: Brain,
        };
      case "ethics":
        return {
          label: "Right & Wrong (Values)",
          color: "bg-emerald-100 text-emerald-800 border-emerald-300",
          icon: Scale,
        };
      case "behavioral":
        return {
          label: "Behavior & Mindset",
          color: "bg-purple-100 text-purple-800 border-purple-300",
          icon: Zap,
        };
      case "character":
        return {
          label: "Character Match",
          color: "bg-rose-100 text-rose-800 border-rose-300",
          icon: Sparkles,
        };
      default:
        return {
          label: "Personality & Thinking Quiz",
          color: "bg-stone-100 text-stone-800 border-stone-300",
          icon: Award,
        };
    }
  };

  const getEngineChip = (slug: string, testType?: string) => {
    if (slug.includes("cognitive") || testType === "cognitive_iq") {
      return {
        label: "8-Skill Thinking Chart & Score Curve",
        color: "bg-blue-500/10 text-blue-900 border-blue-300",
      };
    }
    if (slug.includes("personality") || slug.includes("big-five") || testType === "big_five") {
      return {
        label: "5-Trait Personality Star Chart",
        color: "bg-amber-500/10 text-amber-900 border-amber-300",
      };
    }
    if (slug.includes("moral") || testType === "moral_alignment") {
      return {
        label: "2-Axis Values Map",
        color: "bg-emerald-500/10 text-emerald-900 border-emerald-300",
      };
    }
    if (slug.includes("dark") || testType === "dark_triad") {
      return {
        label: "3-Trait Behavior Triangle & Average Ring",
        color: "bg-rose-500/10 text-rose-900 border-rose-300",
      };
    }
    if (slug.includes("harry-potter") || testType === "harry_potter") {
      return {
        label: "6-Trait Character Match Chart",
        color: "bg-rose-500/10 text-rose-900 border-rose-300",
      };
    }
    return {
      label: "Clear Score Breakdown Chart",
      color: "bg-stone-100 text-stone-800 border-stone-300",
    };
  };

  return (
    <main className="flex-1 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-5xl space-y-12">
        {/* Top Profile & Portal Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border bg-surface text-xs font-semibold text-charcoal-700 shadow-warm-sm">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span>Easy-to-Read Personality, Thinking & Values Quizzes</span>
          </div>
          <ProfileHeaderButton />
        </div>

        {/* Editorial Hero Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">

          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-charcoal-900 font-sans leading-tight">
            Simple Quizzes for Personality, Thinking & Values
          </h1>

          <p className="text-base sm:text-lg text-charcoal-700 leading-relaxed font-sans">
            Take short quizzes about how you think, feel, and make choices. Get instant result badges,
            easy-to-read charts comparing your score with other people, and a clear privacy agreement.
          </p>
        </div>

        {/* Featured Test Grid */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold text-charcoal-900 font-sans">
                Available Quizzes
              </h2>
            </div>
            <span className="font-mono text-xs text-charcoal-500 font-medium">
              {activeCampaigns.length} Active Quizzes
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeCampaigns.map((camp) => {
              let parsedSchema: any = {};
              try {
                parsedSchema = JSON.parse(camp.schemaJson);
              } catch {
                parsedSchema = {};
              }

              const category = parsedSchema.category || "general";
              const badge = getCategoryBadge(category, camp.slug);
              const engineChip = getEngineChip(camp.slug, parsedSchema.testType);
              const BadgeIcon = badge.icon;
              const estMinutes = parsedSchema.estimatedMinutes || 3;

              // Calculate total questions
              const totalQuestions =
                parsedSchema.steps?.reduce(
                  (acc: number, s: any) => acc + (s.questions?.length || 0),
                  0
                ) || 10;

              return (
                <div
                  key={camp.id}
                  className="rounded-tactile border border-border bg-surface p-6 shadow-warm-md hover:shadow-warm-lg hover:border-primary/50 transition-all duration-200 flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-semibold tracking-wide uppercase font-mono ${badge.color}`}
                      >
                        <BadgeIcon className="h-3 w-3" />
                        {badge.label}
                      </span>

                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-charcoal-500">
                        <BarChart3 className="h-3 w-3 text-primary" />
                        {camp._count.responses} finished
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-charcoal-900 leading-snug">
                      {camp.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-charcoal-700 leading-relaxed line-clamp-3">
                      {camp.description}
                    </p>

                    {/* Visual Engine Chip */}
                    <div className="pt-1">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-mono font-medium ${engineChip.color}`}
                      >
                        <Zap className="h-3 w-3 text-primary shrink-0" />
                        <span>{engineChip.label}</span>
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs text-charcoal-500 font-mono">
                      <span>{totalQuestions} questions</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        ~{estMinutes} min
                      </span>
                    </div>

                    <Link
                      href={`/s/${camp.slug}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-xs sm:text-sm font-semibold shadow-warm-sm transition-all hover:-translate-y-0.5"
                    >
                      <span>Start Quiz</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Value Proposition Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
          <div className="rounded-tactile border border-border bg-surface p-5 shadow-warm-sm space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <Brain className="h-4 w-4" />
              <span>Clear & Fair Questions</span>
            </div>
            <p className="text-xs text-charcoal-700 leading-relaxed">
              Simple 5-step agree/disagree scales, balanced questions to keep scores fair, and visual pattern puzzles.
            </p>
          </div>

          <div className="rounded-tactile border border-border bg-surface p-5 shadow-warm-sm space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <ShieldCheck className="h-4 w-4" />
              <span>Locked Privacy Agreement</span>
            </div>
            <p className="text-xs text-charcoal-700 leading-relaxed">
              You review and agree to our simple privacy rules before seeing your results, saved with a unique security code.
            </p>
          </div>

          <div className="rounded-tactile border border-border bg-surface p-5 shadow-warm-sm space-y-2">
            <div className="flex items-center gap-2 text-primary font-semibold text-sm">
              <Award className="h-4 w-4" />
              <span>Instant Results</span>
            </div>
            <p className="text-xs text-charcoal-700 leading-relaxed">
              Get your result type, score bars for each trait, and a clear everyday summary right away.
            </p>
          </div>
        </div>

      </div>
    </main>
  );
}

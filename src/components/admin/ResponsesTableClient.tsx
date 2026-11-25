"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  CheckCircle2,
  Eye,
  X,
  FileSpreadsheet,
  Lock,
  User,
  CheckCircle2 as CheckIcon,
  XCircle,
} from "lucide-react";
import type { DetailedAnswerLogItem } from "@/lib/answer-logs";

interface SerializedResponseItem {
  id: string;
  respondentRef: string | null;
  campaignSlug: string;
  campaignTitle: string;
  answersJson: string;
  answerLogsJson?: string | null;
  completionSec: number;
  createdAt: string;
  profile?: {
    fullName: string;
    email: string;
    birthDate: string;
    gender: string;
    notes: string;
  } | null;
  consent: {
    tcVersion: string;
    tcChecksum: string;
    ipHash: string;
    agreedAt: string;
    userAgent: string;
  } | null;
}

export function ResponsesTableClient({
  responses,
  campaignSlugs,
}: {
  responses: SerializedResponseItem[];
  campaignSlugs: string[];
}) {
  const [selectedSlug, setSelectedSlug] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeInspect, setActiveInspect] = useState<SerializedResponseItem | null>(null);

  // Filtered responses based on slug and search query
  const filteredResponses = useMemo(() => {
    return responses.filter((item) => {
      const matchesSlug = selectedSlug === "all" || item.campaignSlug === selectedSlug;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        (item.respondentRef && item.respondentRef.toLowerCase().includes(q)) ||
        (item.profile && item.profile.fullName.toLowerCase().includes(q)) ||
        (item.profile && item.profile.email.toLowerCase().includes(q)) ||
        item.campaignSlug.toLowerCase().includes(q) ||
        item.answersJson.toLowerCase().includes(q);

      return matchesSlug && matchesSearch;
    });
  }, [responses, selectedSlug, searchQuery]);

  return (
    <div className="space-y-6">
      {/* Filtering & Search Toolbar */}
      <div className="rounded-tactile border border-border bg-surface p-4 shadow-warm-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {/* Campaign Selector */}
          <div className="relative w-full sm:w-60">
            <select
              value={selectedSlug}
              onChange={(e) => setSelectedSlug(e.target.value)}
              className="w-full appearance-none px-3.5 py-2 rounded-lg border border-border bg-canvas-subtle text-charcoal-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-primary pr-8 cursor-pointer"
            >
              <option value="all">All Quizzes ({responses.length})</option>
              {campaignSlugs.map((slug) => (
                <option key={slug} value={slug}>
                  /s/{slug}
                </option>
              ))}
            </select>
            <Filter className="pointer-events-none absolute right-2.5 top-2.5 h-3.5 w-3.5 text-charcoal-500" />
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by receipt ID or answer..."
              className="w-full px-3.5 py-2 pl-9 rounded-lg border border-border bg-canvas-subtle text-charcoal-900 placeholder:text-charcoal-500 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-charcoal-500" />
          </div>
        </div>

        {/* Download Filtered CSV Button */}
        <a
          href={`/api/export?format=csv${selectedSlug !== "all" ? `&campaignSlug=${selectedSlug}` : ""}`}
          download
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-medium shadow-warm-sm transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Download ({filteredResponses.length}) as CSV
        </a>
      </div>

      {/* Responses Tabular Grid */}
      <div className="rounded-tactile border border-border bg-surface shadow-warm-md overflow-hidden">
        {filteredResponses.length === 0 ? (
          <div className="p-12 text-center text-xs text-charcoal-500 font-mono">
            No answers match your search or filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal-700">
              <thead className="bg-canvas-subtle border-b border-border font-mono uppercase text-[11px] text-charcoal-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Person</th>
                  <th className="px-5 py-3 font-semibold">Receipt ID</th>
                  <th className="px-5 py-3 font-semibold">Quiz</th>
                  <th className="px-5 py-3 font-semibold">Time Taken</th>
                  <th className="px-5 py-3 font-semibold">Saved At (UTC)</th>
                  <th className="px-5 py-3 font-semibold">Privacy Check</th>
                  <th className="px-5 py-3 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border font-mono">
                {filteredResponses.map((item) => (
                  <tr key={item.id} className="hover:bg-canvas-subtle/50 transition-colors">
                    <td className="px-5 py-3.5 font-sans">
                      {item.profile ? (
                        <div>
                          <div className="font-semibold text-charcoal-900">{item.profile.fullName}</div>
                          <div className="text-[11px] font-mono text-charcoal-500">{item.profile.email}</div>
                        </div>
                      ) : (
                        <span className="text-charcoal-400 font-mono text-[11px]">Legacy / No Profile</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-bold text-charcoal-900">
                      {item.respondentRef || item.id.substring(0, 8)}
                    </td>
                    <td className="px-5 py-3.5 text-charcoal-700">
                      /s/{item.campaignSlug}
                    </td>
                    <td className="px-5 py-3.5 text-charcoal-700">
                      {item.completionSec}s
                    </td>
                    <td className="px-5 py-3.5 text-charcoal-500">
                      {new Date(item.createdAt).toUTCString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1 text-[11px] text-success font-medium">
                        <CheckCircle2 className="h-3.5 w-3.5 text-success" />
                        Agreed (v{item.consent?.tcVersion || "1.0"})
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => setActiveInspect(item)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md border border-border bg-surface hover:bg-canvas text-charcoal-700 hover:text-charcoal-900 text-xs transition-colors shadow-warm-sm"
                      >
                        <Eye className="h-3 w-3 text-primary" />
                        View Answers
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Answer Inspection Modal */}
      {activeInspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-tactile border border-border bg-surface p-6 sm:p-8 shadow-warm-xl space-y-6 text-charcoal-900 my-8">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div>
                <span className="font-mono text-xs text-primary font-semibold block uppercase">
                  Answer Details
                </span>
                <h3 className="text-xl font-bold text-charcoal-900 tracking-tight font-sans">
                  {activeInspect.respondentRef || activeInspect.id}
                </h3>
                <span className="font-mono text-xs text-charcoal-500">
                  Quiz: /{activeInspect.campaignSlug} • {new Date(activeInspect.createdAt).toUTCString()}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setActiveInspect(null)}
                className="p-1 rounded text-charcoal-500 hover:text-charcoal-900 hover:bg-canvas-subtle"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Respondent Identity Card */}
            {activeInspect.profile && (
              <div className="p-3.5 rounded-lg bg-amber-50/70 border border-amber-200 text-xs space-y-1">
                <div className="flex items-center gap-2 text-charcoal-900 font-semibold">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span>{activeInspect.profile.fullName}</span>
                  <span className="text-charcoal-500 font-mono font-normal">
                    ({activeInspect.profile.email})
                  </span>
                </div>
                <div className="text-[11px] font-mono text-charcoal-700">
                  Birth Date: {activeInspect.profile.birthDate} • Gender: {activeInspect.profile.gender}
                </div>
                {activeInspect.profile.notes && (
                  <div className="text-[11px] text-charcoal-700 pt-1">
                    Other details: {activeInspect.profile.notes}
                  </div>
                )}
              </div>
            )}

            {/* Cryptographic Consent Proof Banner */}
            <div className="p-3.5 rounded-lg bg-canvas-subtle border border-border text-xs space-y-1 font-mono">
              <div className="flex items-center gap-2 text-charcoal-900 font-semibold">
                <Lock className="h-3.5 w-3.5 text-primary" />
                <span>Privacy Agreement Proof:</span>
              </div>
              <div className="text-[11px] text-charcoal-500 break-all">
                Rules Security Code (SHA-256): {activeInspect.consent?.tcChecksum || "N/A"}
              </div>
              <div className="text-[11px] text-charcoal-500 break-all">
                Masked Network Address Hash: {activeInspect.consent?.ipHash || "N/A"}
              </div>
            </div>

            {/* Answer Key-Value List */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              <h4 className="text-xs font-mono uppercase text-charcoal-500 font-semibold">
                Answers & Quiz Results:
              </h4>
              {(() => {
                try {
                  const rawAnswers = JSON.parse(activeInspect.answersJson);
                  const psychometrics = rawAnswers._psychometrics;
                  const displayAnswers = { ...rawAnswers };
                  delete displayAnswers._psychometrics;

                  return (
                    <div className="space-y-3">
                      {psychometrics && (
                        <div className="p-3.5 rounded-lg border border-primary/30 bg-primary/5 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-xs font-bold text-primary uppercase">
                              Result Type:
                            </span>
                            {psychometrics.primaryMetricLabel && (
                              <span className="text-xs font-mono font-bold bg-surface px-2 py-0.5 rounded border border-border">
                                {psychometrics.primaryMetricLabel}: {psychometrics.primaryMetricValue}
                              </span>
                            )}
                          </div>
                          <div className="text-sm font-bold text-charcoal-900">
                            {psychometrics.archetypeTitle}
                          </div>
                          <div className="text-xs text-charcoal-700 italic">
                            "{psychometrics.archetypeSubtitle}"
                          </div>

                          {Array.isArray(psychometrics.traits) && (
                            <div className="pt-2 grid grid-cols-2 gap-2 text-xs">
                              {psychometrics.traits.map((t: any) => (
                                <div key={t.key} className="bg-surface p-2 rounded border border-border">
                                  <div className="font-semibold text-charcoal-900 flex justify-between">
                                    <span>{t.name}</span>
                                    <span className="font-mono">{t.score}%</span>
                                  </div>
                                  <div className="text-[10px] text-charcoal-500 font-mono">
                                    {t.level}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {(() => {
                        let parsedLogs: DetailedAnswerLogItem[] = [];
                        try {
                          if (activeInspect.answerLogsJson) {
                            parsedLogs = JSON.parse(activeInspect.answerLogsJson);
                          }
                        } catch {
                          parsedLogs = [];
                        }

                        if (parsedLogs.length > 0) {
                          return (
                            <div className="space-y-2">
                              <div className="text-[11px] font-mono uppercase text-charcoal-500 font-semibold">
                                Full Question-by-Question Log ({parsedLogs.length} items)
                              </div>
                              {parsedLogs.map((entry, idx) => (
                                <div
                                  key={entry.questionId}
                                  className="p-3 rounded-lg border border-border bg-canvas text-xs space-y-1"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <span className="font-medium text-charcoal-900">
                                      <span className="font-mono text-charcoal-500 mr-1.5">Q{idx + 1}.</span>
                                      {entry.questionTitle}
                                    </span>
                                    {entry.isCorrect !== undefined && (
                                      <span
                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${
                                          entry.isCorrect ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                                        }`}
                                      >
                                        {entry.isCorrect ? <CheckIcon className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                        {entry.isCorrect ? "Correct" : "Wrong"}
                                      </span>
                                    )}
                                  </div>
                                  <span className="font-semibold text-primary block">
                                    Picked: {entry.selectedLabel}
                                  </span>
                                </div>
                              ))}
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-2">
                            {Object.entries(displayAnswers).map(([key, value]) => (
                              <div
                                key={key}
                                className="p-3 rounded-lg border border-border bg-canvas text-xs space-y-1"
                              >
                                <span className="font-mono text-charcoal-500 text-[11px] font-semibold block">
                                  {key}
                                </span>
                                <span className="font-sans text-charcoal-900 font-medium block">
                                  {Array.isArray(value) ? value.join(", ") : String(value)}
                                </span>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  );
                } catch {
                  return (
                    <pre className="p-3 rounded-lg bg-canvas border border-border text-xs font-mono">
                      {activeInspect.answersJson}
                    </pre>
                  );
                }
              })()}
            </div>

            <div className="pt-3 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={() => setActiveInspect(null)}
                className="px-5 py-2 rounded-lg bg-primary hover:bg-primary-hover text-white text-xs font-medium shadow-warm-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

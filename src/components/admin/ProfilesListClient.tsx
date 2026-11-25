"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  User,
  Mail,
  Clock,
  ChevronDown,
  ChevronUp,
  Eye,
  X,
  CheckCircle2,
  XCircle,
  FileText,
} from "lucide-react";
import type { DetailedAnswerLogItem } from "@/lib/answer-logs";

interface ProfileResponseItem {
  id: string;
  respondentRef: string | null;
  campaignSlug: string;
  campaignTitle: string;
  answersJson: string;
  answerLogsJson: string | null;
  completionSec: number;
  createdAt: string;
  consent: {
    tcVersion: string;
    tcChecksum: string;
    agreedAt: string;
  } | null;
}

interface SerializedProfileItem {
  id: string;
  fullName: string;
  email: string;
  birthDate: string;
  gender: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  responses: ProfileResponseItem[];
}

export function ProfilesListClient({
  profiles,
}: {
  profiles: SerializedProfileItem[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeProfile, setActiveProfile] = useState<SerializedProfileItem | null>(null);
  const [expandedResponseId, setExpandedResponseId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return profiles;
    return profiles.filter(
      (p) =>
        p.fullName.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.notes.toLowerCase().includes(q)
    );
  }, [profiles, searchQuery]);

  const openProfile = (p: SerializedProfileItem) => {
    setActiveProfile(p);
    setExpandedResponseId(p.responses[0]?.id || null);
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="rounded-tactile border border-border bg-surface p-4 shadow-warm-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or notes..."
            className="w-full px-3.5 py-2 pl-9 rounded-lg border border-border bg-canvas-subtle text-charcoal-900 placeholder:text-charcoal-500 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-charcoal-500" />
        </div>
        <div className="text-xs font-mono text-charcoal-500">
          {filtered.length} Saved {filtered.length === 1 ? "Profile" : "Profiles"}
        </div>
      </div>

      {/* Profiles List */}
      <div className="rounded-tactile border border-border bg-surface shadow-warm-md overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-xs text-charcoal-500 font-mono">
            No respondent profiles saved yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-charcoal-700">
              <thead className="bg-canvas-subtle border-b border-border font-mono uppercase text-[11px] text-charcoal-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Birth Date / Gender</th>
                  <th className="px-5 py-3 font-semibold">Quizzes Taken</th>
                  <th className="px-5 py-3 font-semibold">Last Active (UTC)</th>
                  <th className="px-5 py-3 font-semibold text-right">Logs</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-canvas-subtle/50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-charcoal-900">
                      <div className="flex items-center gap-2">
                        <User className="h-3.5 w-3.5 text-primary shrink-0" />
                        <span>{p.fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-charcoal-700">{p.email}</td>
                    <td className="px-5 py-3.5 font-mono text-charcoal-700">
                      {p.birthDate} • {p.gender}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-primary">
                      {p.responses.length}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-charcoal-500">
                      {new Date(p.updatedAt).toUTCString()}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => openProfile(p)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border bg-surface hover:bg-canvas text-charcoal-800 text-xs font-medium shadow-warm-xs"
                      >
                        <Eye className="h-3.5 w-3.5 text-primary" />
                        <span>View Full Logs</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Profile & Full Question-by-Question Answer Logs Modal */}
      {activeProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl rounded-tactile border border-border bg-surface p-6 sm:p-8 shadow-warm-xl space-y-6 text-charcoal-900 my-8">
            <div className="flex items-start justify-between border-b border-border pb-4">
              <div className="space-y-1">
                <span className="font-mono text-xs text-primary font-semibold uppercase block">
                  Respondent Identity & Full Quiz History
                </span>
                <h2 className="text-xl font-bold text-charcoal-900">{activeProfile.fullName}</h2>
                <div className="flex flex-wrap items-center gap-3 text-xs text-charcoal-600 font-mono">
                  <span className="inline-flex items-center gap-1">
                    <Mail className="h-3 w-3 text-primary" />
                    {activeProfile.email}
                  </span>
                  <span>•</span>
                  <span>Born {activeProfile.birthDate}</span>
                  <span>•</span>
                  <span>{activeProfile.gender}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveProfile(null)}
                className="p-1.5 rounded-lg text-charcoal-500 hover:text-charcoal-900 hover:bg-canvas-subtle"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {activeProfile.notes && (
              <div className="rounded-lg border border-border bg-canvas-subtle p-3.5 text-xs space-y-1">
                <span className="font-mono text-[11px] uppercase text-charcoal-500 font-semibold block">
                  Other Details Provided
                </span>
                <p className="text-charcoal-900 whitespace-pre-wrap">{activeProfile.notes}</p>
              </div>
            )}

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              <h3 className="text-xs font-mono uppercase text-charcoal-500 font-semibold">
                Completed Quizzes ({activeProfile.responses.length})
              </h3>

              {activeProfile.responses.length === 0 ? (
                <p className="text-xs text-charcoal-500 font-mono p-4 border border-border rounded-lg bg-canvas">
                  This user saved their profile but has not submitted a quiz yet.
                </p>
              ) : (
                activeProfile.responses.map((resp) => {
                  const isOpen = expandedResponseId === resp.id;
                  let psych: any = null;
                  let logs: DetailedAnswerLogItem[] = [];
                  try {
                    const raw = JSON.parse(resp.answersJson);
                    psych = raw?._psychometrics || null;
                  } catch {
                    psych = null;
                  }
                  try {
                    if (resp.answerLogsJson) {
                      logs = JSON.parse(resp.answerLogsJson);
                    }
                  } catch {
                    logs = [];
                  }

                  return (
                    <div key={resp.id} className="rounded-xl border border-border bg-canvas overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setExpandedResponseId(isOpen ? null : resp.id)}
                        className="w-full p-4 flex items-center justify-between gap-3 text-left hover:bg-canvas-subtle transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-semibold text-sm text-charcoal-900">
                              {resp.campaignTitle}
                            </span>
                            {psych?.archetypeTitle && (
                              <span className="px-2 py-0.5 rounded-full bg-primary/10 border border-primary/30 text-[11px] font-semibold text-primary">
                                {psych.archetypeTitle}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono text-charcoal-500">
                            <span>{resp.respondentRef || resp.id}</span>
                            <span>•</span>
                            <span className="inline-flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {resp.completionSec}s
                            </span>
                            <span>•</span>
                            <span>{new Date(resp.createdAt).toUTCString()}</span>
                          </div>
                        </div>
                        {isOpen ? (
                          <ChevronUp className="h-4 w-4 text-charcoal-500 shrink-0" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-charcoal-500 shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <div className="border-t border-border bg-surface p-4 space-y-3">
                          {logs.length > 0 ? (
                            <div className="space-y-2">
                              <div className="flex items-center gap-1.5 text-[11px] font-mono uppercase text-charcoal-500 font-semibold">
                                <FileText className="h-3.5 w-3.5 text-primary" />
                                <span>Question-by-Question Log ({logs.length} questions)</span>
                              </div>
                              {logs.map((entry, idx) => (
                                <div
                                  key={`${resp.id}-${entry.questionId}`}
                                  className="p-3 rounded-lg border border-border bg-canvas-subtle text-xs space-y-1.5"
                                >
                                  <div className="flex items-start justify-between gap-2">
                                    <span className="font-medium text-charcoal-900">
                                      <span className="font-mono text-charcoal-500 mr-1.5">
                                        Q{idx + 1}.
                                      </span>
                                      {entry.questionTitle}
                                    </span>
                                    {entry.isCorrect !== undefined && (
                                      <span
                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold shrink-0 ${
                                          entry.isCorrect
                                            ? "bg-emerald-100 text-emerald-800"
                                            : "bg-rose-100 text-rose-800"
                                        }`}
                                      >
                                        {entry.isCorrect ? (
                                          <>
                                            <CheckCircle2 className="h-3 w-3" /> Correct
                                          </>
                                        ) : (
                                          <>
                                            <XCircle className="h-3 w-3" /> Wrong
                                          </>
                                        )}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-border/50">
                                    <span className="font-semibold text-primary">
                                      Picked: {entry.selectedLabel}
                                    </span>
                                    <span className="font-mono text-[10px] text-charcoal-500">
                                      {entry.traitKey ? `trait: ${entry.traitKey}` : entry.questionType}
                                      {entry.isReverse ? " (reverse)" : ""}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs font-mono text-charcoal-500">
                              Legacy submission without structured question log. Inspect raw answers in /admin/responses.
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-3 border-t border-border flex justify-end">
              <button
                type="button"
                onClick={() => setActiveProfile(null)}
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

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Lock, ArrowRight, AlertCircle, Loader2, ArrowLeft } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [secret, setSecret] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secret.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Wrong passcode. Please try again.");
      }

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Could not sign in. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex flex-col justify-center items-center px-4 py-16">
      <div className="w-full max-w-md space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-charcoal-700 hover:text-charcoal-900 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Home
        </Link>

        <div className="rounded-tactile border border-border bg-surface p-8 shadow-warm-xl space-y-6">
          <div className="space-y-2 text-center">
            <div className="mx-auto h-12 w-12 rounded-lg bg-primary-soft border border-primary/20 flex items-center justify-center text-primary shadow-warm-sm">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-semibold text-charcoal-900 tracking-tight font-sans">
              Admin Sign In
            </h1>
            <p className="text-xs text-charcoal-700 leading-relaxed">
              Type your admin passcode to check quiz stats, read saved answers, and download reports.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-mono uppercase tracking-wider text-charcoal-700 font-semibold">
                Admin Passcode
              </label>
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Type admin passcode..."
                required
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-surface text-charcoal-900 placeholder:text-charcoal-500 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent font-mono shadow-warm-sm"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-terracotta-soft text-terracotta text-xs font-medium border border-terracotta/20">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !secret.trim()}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-primary hover:bg-primary-hover active:bg-primary-active text-white text-sm font-medium shadow-warm-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Sign In to Admin
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-[11px] text-charcoal-500 font-mono">
            Default test passcode: <code className="bg-canvas-subtle px-1.5 py-0.5 rounded border border-border">dev-insecure-admin-key-change-in-prod</code>
          </div>
        </div>
      </div>
    </div>
  );
}

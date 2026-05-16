"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { Check, CreditCard, Sparkles, Zap } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { useAuth } from "@/context/AuthContext";
import { createCheckoutSession, getBillingConfig, getBillingStatus } from "@/lib/api/billing";
import { ApiClientError } from "@/lib/api/client";
import type { BillingConfig, BillingStatus } from "@/types/billing.types";

function BillingContent() {
  const searchParams = useSearchParams();
  const { user, getToken, refreshUser } = useAuth();
  const [config, setConfig] = useState<BillingConfig | null>(null);
  const [status, setStatus] = useState<BillingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const isPro = user?.plan === "pro" || status?.plan === "pro";

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [cfg, token] = await Promise.all([getBillingConfig(), getToken()]);
      setConfig(cfg);
      if (token) {
        setStatus(await getBillingStatus(token));
      }
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not load billing.");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (searchParams.get("success") === "1") {
      setNotice("Payment received. Your Pro plan will activate in a few seconds.");
      void refreshUser().then(() => load());
    } else if (searchParams.get("canceled") === "1") {
      setNotice("Checkout canceled. You can upgrade anytime.");
    }
  }, [searchParams, refreshUser, load]);

  async function handleUpgrade() {
    const token = await getToken();
    if (!token) return;
    setCheckoutLoading(true);
    setError("");
    try {
      const { checkout_url } = await createCheckoutSession(token);
      window.location.href = checkout_url;
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not start checkout.");
      setCheckoutLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[240px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-brand)]/30 border-t-[var(--color-brand)]" />
      </div>
    );
  }

  const freeQuota = config?.free_daily_ai_quota ?? 30;
  const proQuota = config?.pro_daily_ai_quota ?? 200;
  const proLabel = config?.pro_price_label ?? "DevFolio Pro";

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Billing & plans"
        description="Upgrade to Pro for a higher daily AI quota. Stripe test mode — use card 4242 4242 4242 4242."
      />

      {notice ? (
        <p className="mb-4 rounded-xl border border-[var(--color-mint)]/40 bg-[var(--color-mint)]/10 px-4 py-3 text-sm text-[var(--color-navy-900)]">
          {notice}
        </p>
      ) : null}
      {error ? (
        <p className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mb-6 flex flex-wrap items-center gap-3 rounded-xl border border-[var(--color-cyan-100)] bg-white px-4 py-3 text-sm shadow-sm">
        <CreditCard className="h-5 w-5 text-[var(--color-brand)]" />
        <span>
          Current plan:{" "}
          <strong className={isPro ? "text-[var(--color-brand)]" : ""}>
            {isPro ? "Pro" : "Free"}
          </strong>
          {status ? (
            <span className="text-[var(--color-text-secondary)]">
              {" "}
              · {status.daily_ai_quota} AI requests / day
            </span>
          ) : null}
        </span>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-[var(--color-cyan-100)] bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[var(--color-navy-900)]">
              <Zap className="h-5 w-5 text-[var(--color-muted)]" />
              Free
            </CardTitle>
          </CardHeader>
          <ul className="space-y-2 px-6 pb-6 text-sm text-[var(--color-text-secondary)]">
            <li className="flex gap-2">
              <Check className="h-4 w-4 shrink-0 text-[var(--color-mint-dark)]" />
              Job tracker & portfolio
            </li>
            <li className="flex gap-2">
              <Check className="h-4 w-4 shrink-0 text-[var(--color-mint-dark)]" />
              {freeQuota} AI analyses per day
            </li>
          </ul>
          <div className="border-t border-[var(--color-cyan-50)] px-6 py-4">
            <p className="text-2xl font-bold text-[var(--color-navy-900)]">$0</p>
            <p className="text-xs text-[var(--color-text-secondary)]">Included for all users</p>
          </div>
        </Card>

        <Card
          className={`border-2 bg-white ${
            isPro
              ? "border-[var(--color-brand)] ring-2 ring-[var(--color-brand)]/20"
              : "border-[var(--color-brand)]/50"
          }`}
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[var(--color-navy-900)]">
              <Sparkles className="h-5 w-5 text-[var(--color-brand)]" />
              {proLabel}
            </CardTitle>
            <span className="inline-flex w-fit rounded-full bg-[var(--color-brand)]/10 px-2 py-0.5 text-xs font-medium text-[var(--color-brand)]">
              Recommended for power users
            </span>
          </CardHeader>
          <ul className="space-y-2 px-6 pb-6 text-sm text-[var(--color-text-secondary)]">
            <li className="flex gap-2">
              <Check className="h-4 w-4 shrink-0 text-[var(--color-brand)]" />
              Everything in Free
            </li>
            <li className="flex gap-2">
              <Check className="h-4 w-4 shrink-0 text-[var(--color-brand)]" />
              {proQuota} AI analyses per day
            </li>
            <li className="flex gap-2">
              <Check className="h-4 w-4 shrink-0 text-[var(--color-brand)]" />
              Stripe Checkout integration (test mode)
            </li>
          </ul>
          <div className="border-t border-[var(--color-cyan-50)] px-6 py-4">
            {isPro ? (
              <p className="text-sm font-medium text-[var(--color-brand)]">You are on Pro. Thank you!</p>
            ) : config?.configured ? (
              <Button
                variant="primary"
                className="w-full"
                isLoading={checkoutLoading}
                onClick={handleUpgrade}
              >
                Upgrade with Stripe
              </Button>
            ) : (
              <p className="text-sm text-amber-700">
                Payments are not configured on the API yet. Add Stripe env vars on Render.
              </p>
            )}
          </div>
        </Card>
      </div>

      <p className="mt-8 text-center text-xs text-[var(--color-text-secondary)]">
        After subscribing, webhooks activate Pro on your account.{" "}
        <Link href="/dashboard/ai" className="text-[var(--color-brand)] underline">
          AI Studio
        </Link>
      </p>
    </div>
  );
}

export default function BillingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[200px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-brand)]/30 border-t-[var(--color-brand)]" />
        </div>
      }
    >
      <BillingContent />
    </Suspense>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, CreditCard, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { getBillingConfig } from "@/lib/api/billing";
import {
  BILLING_REDIRECT,
  loginHref,
  registerHref,
} from "@/lib/helpers/authRedirect";
import type { BillingConfig } from "@/types/billing.types";

const FREE_FEATURES = [
  "Public portfolio page",
  "Job application tracker",
  "AI resume & job-match analysis",
];

const PRO_FEATURES = [
  "Everything in Free",
  "Higher daily AI quota",
  "Stripe subscription (test mode for demo)",
  "Cancel anytime from Stripe",
];

export function PricingSection() {
  const { isAuthenticated, isLoading } = useAuth();
  const [config, setConfig] = useState<BillingConfig | null>(null);

  useEffect(() => {
    getBillingConfig()
      .then(setConfig)
      .catch(() => setConfig(null));
  }, []);

  const freeQuota = config?.free_daily_ai_quota ?? 30;
  const proQuota = config?.pro_daily_ai_quota ?? 200;
  const proLabel = config?.pro_price_label ?? "DevFolio Pro";

  const subscribeHref = isAuthenticated
    ? BILLING_REDIRECT
    : loginHref(BILLING_REDIRECT);

  return (
    <section id="pricing" className="bg-[var(--color-cyan-50)]/40 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-brand)]">
            Pricing
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-navy-900)] sm:text-4xl">
            Simple plans for your job search
          </h2>
          <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
            Start free. Upgrade to Pro when you need more AI analyses per day.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <article className="flex flex-col rounded-2xl border border-[var(--color-cyan-100)] bg-white p-8 shadow-sm">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-[var(--color-muted)]" />
              <h3 className="text-xl font-bold text-[var(--color-navy-900)]">Free</h3>
            </div>
            <p className="mt-2 text-3xl font-bold text-[var(--color-navy-900)]">
              $0
              <span className="text-base font-normal text-[var(--color-text-secondary)]">
                {" "}
                / forever
              </span>
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
              {freeQuota} AI requests per day
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {FREE_FEATURES.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-[var(--color-text-secondary)]">
                  <Check className="h-4 w-4 shrink-0 text-[var(--color-mint-dark)]" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href={isAuthenticated ? "/dashboard" : registerHref()}
              className="mt-8 block"
            >
              <Button variant="outline" className="w-full">
                {isAuthenticated ? "Go to dashboard" : "Get started free"}
              </Button>
            </Link>
          </article>

          <article className="relative flex flex-col rounded-2xl border-2 border-[var(--color-brand)] bg-white p-8 shadow-lg shadow-[var(--color-brand)]/10">
            <span className="absolute -top-3 left-6 rounded-full bg-[var(--color-brand)] px-3 py-0.5 text-xs font-semibold text-white">
              Popular
            </span>
            <div className="flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-[var(--color-brand)]" />
              <h3 className="text-xl font-bold text-[var(--color-navy-900)]">{proLabel}</h3>
            </div>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">
              Billed monthly via Stripe · test card{" "}
              <code className="rounded bg-[var(--color-cyan-100)] px-1 text-xs">4242…</code>
            </p>
            <p className="mt-3 text-3xl font-bold text-[var(--color-brand)]">
              Pro
              <span className="text-base font-normal text-[var(--color-text-secondary)]">
                {" "}
                · {proQuota} AI / day
              </span>
            </p>
            <ul className="mt-6 flex-1 space-y-3">
              {PRO_FEATURES.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-[var(--color-text-secondary)]">
                  <Check className="h-4 w-4 shrink-0 text-[var(--color-brand)]" />
                  {item}
                </li>
              ))}
            </ul>
            <Link href={subscribeHref} className="mt-8 block">
              <Button variant="primary" className="w-full">
                <CreditCard className="h-4 w-4" />
                {isAuthenticated ? "Upgrade to Pro" : "Subscribe — sign in first"}
              </Button>
            </Link>
            {!isLoading && !isAuthenticated ? (
              <p className="mt-3 text-center text-xs text-[var(--color-text-secondary)]">
                You&apos;ll sign in, then complete checkout on the billing page.
              </p>
            ) : null}
          </article>
        </div>
      </div>
    </section>
  );
}

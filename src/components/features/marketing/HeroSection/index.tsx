import Link from "next/link";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProductPreview } from "@/components/features/marketing/ProductPreview";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden gradient-hero grid-pattern pt-8 pb-20 sm:pt-12 sm:pb-28">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-32 top-20 h-96 w-96 rounded-full bg-[var(--color-mint)]/10 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-[var(--color-brand)]/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="animate-fade-up text-center lg:text-left" style={{ animationDelay: "0ms" }}>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-brand)]/20 bg-white/80 px-4 py-2 text-sm font-medium text-[var(--color-brand-dark)] shadow-sm backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-[var(--color-mint-dark)]" />
              AI-powered developer career platform
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-[var(--color-navy-900)] sm:text-5xl lg:text-[3.25rem]">
              Ship your portfolio.
              <br />
              <span className="text-gradient-light">Land the role.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-[var(--color-text-secondary)] lg:mx-0">
              One platform for your public developer profile, structured job tracking, and
              AI-powered resume insights — portfolio, job tracking, and career tools in one place.
            </p>

            <ul className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:justify-start">
              {[
                "Shareable portfolio in minutes",
                "Kanban job pipeline",
                "Resume & job-match AI",
              ].map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-2 text-sm font-medium text-[var(--color-navy-800)]"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-[var(--color-mint-dark)]" />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start">
              <Link href="/register">
                <Button size="lg" className="animate-pulse-glow min-w-[180px]">
                  Start free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg" className="min-w-[140px] bg-white/60">
                  Sign in
                </Button>
              </Link>
            </div>

            <p className="mt-6 text-xs text-[var(--color-text-secondary)]">
              No credit card required · Free to start · Your data stays yours
            </p>
          </div>

          <div
            className="animate-fade-up mx-auto w-full max-w-lg lg:max-w-none"
            style={{ animationDelay: "120ms" }}
          >
            <ProductPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CtaSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--color-navy-900)] py-20 sm:py-24">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-[600px] -translate-x-1/2 rounded-full bg-[var(--color-brand)]/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-[var(--color-mint)]/15 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
        <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Ready to impress recruiters?
        </h2>
        <p className="mt-4 text-lg text-[var(--color-cyan-200)]/90">
          Build your public portfolio, organize your search, and sharpen your applications with AI —
          all in one professional workspace.
        </p>
        <Link href="/register" className="mt-10 inline-block">
          <Button size="lg" className="min-w-[220px]">
            Create your DevFolio
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
        <p className="mt-6 text-sm text-[var(--color-muted)]">
          Join developers who ship portfolios that get noticed.
        </p>
      </div>
    </section>
  );
}

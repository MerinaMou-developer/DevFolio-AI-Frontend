import Link from "next/link";
import { cn } from "@/lib/helpers/cn";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  href?: string;
  className?: string;
}

export function StatCard({ label, value, hint, icon: Icon, href, className }: StatCardProps) {
  const baseClass = cn(
    "relative block overflow-hidden rounded-2xl border border-[var(--color-navy-800)] bg-[var(--color-card)] p-5 shadow-lg shadow-black/20 transition-all",
    href && "cursor-pointer hover:border-[var(--color-brand)]/40 hover:shadow-[var(--color-brand)]/10",
    className,
  );

  const inner = (
    <>
      <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-[var(--color-brand)]/10 blur-2xl" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]">
            {label}
          </p>
          <p className="mt-2 text-2xl font-bold text-white">{value}</p>
          {hint ? <p className="mt-1 text-xs text-[var(--color-brand-light)]">{hint}</p> : null}
        </div>
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--color-brand)]/20 text-[var(--color-mint)]">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={baseClass}>
        {inner}
      </Link>
    );
  }

  return <div className={baseClass}>{inner}</div>;
}

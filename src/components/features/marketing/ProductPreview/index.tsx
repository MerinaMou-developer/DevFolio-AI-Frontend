"use client";

import { Briefcase, Sparkles, User } from "lucide-react";

export function ProductPreview() {
  return (
    <div className="animate-float relative">
      <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[var(--color-brand)]/20 via-[var(--color-mint)]/10 to-transparent blur-2xl" />
      <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white shadow-2xl shadow-[var(--color-navy-900)]/15 ring-1 ring-[var(--color-brand)]/10">
        <div className="flex items-center gap-2 border-b border-[var(--color-cyan-100)] bg-[var(--color-cyan-50)] px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--color-mint)]/80" />
          <span className="ml-2 text-xs font-medium text-[var(--color-text-secondary)]">
            app.devfolio.ai/dashboard
          </span>
        </div>

        <div className="grid gap-3 p-4 sm:grid-cols-5 sm:gap-4">
          <aside className="hidden space-y-2 sm:col-span-2 sm:block">
            <NavItem icon={User} label="Profile" active />
            <NavItem icon={Briefcase} label="Jobs" />
            <NavItem icon={Sparkles} label="AI Studio" />
          </aside>

          <div className="space-y-3 sm:col-span-3">
            <div className="rounded-xl border border-[var(--color-cyan-100)] bg-gradient-to-br from-[var(--color-cyan-50)] to-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-brand)]">
                Match score
              </p>
              <p className="mt-1 text-3xl font-bold text-[var(--color-navy-900)]">87%</p>
              <p className="mt-1 text-xs text-[var(--color-text-secondary)]">
                Senior React role · Strong TypeScript fit
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                {
                  label: "Applied",
                  count: 4,
                  color: "bg-[var(--color-brand)]/15 text-[var(--color-brand)]",
                },
                {
                  label: "Interview",
                  count: 2,
                  color: "bg-[var(--color-mint)]/15 text-[var(--color-mint-dark)]",
                },
                { label: "Offer", count: 1, color: "bg-emerald-500/15 text-emerald-700" },
              ].map((col) => (
                <div
                  key={col.label}
                  className="rounded-lg border border-[var(--color-cyan-100)] bg-white p-2.5"
                >
                  <p
                    className={`text-[10px] font-semibold ${col.color} rounded px-1.5 py-0.5 w-fit`}
                  >
                    {col.label}
                  </p>
                  <div className="mt-2 space-y-1.5">
                    {Array.from({ length: col.count }).map((_, i) => (
                      <div
                        key={i}
                        className="h-6 rounded border border-[var(--color-cyan-100)] bg-[var(--color-cyan-50)]"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({
  icon: Icon,
  label,
  active,
}: {
  icon: typeof User;
  label: string;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${
        active
          ? "bg-[var(--color-brand)] font-medium text-white"
          : "text-[var(--color-text-secondary)]"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </div>
  );
}

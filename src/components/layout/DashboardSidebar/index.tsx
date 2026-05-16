"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  ChevronLeft,
  Home,
  Layers,
  LogOut,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/helpers/cn";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: Home, exact: true },
  { href: "/dashboard/profile", label: "Profile", icon: User },
  { href: "/dashboard/tracker", label: "Job tracker", icon: Briefcase },
  { href: "/dashboard/ai", label: "AI Studio", icon: Sparkles },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const mounted = useMounted();

  const showAdmin = mounted && user?.role === "admin";
  const initials =
    mounted && user?.email ? user.email.slice(0, 2).toUpperCase() : "DF";
  const displayName =
    mounted && user?.email ? user.email.split("@")[0] : "Developer";
  const displayEmail = mounted ? (user?.email ?? "") : "";

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-[var(--color-navy-800)] bg-[var(--color-navy-900)]">
      <div className="flex h-16 items-center gap-2.5 border-b border-[var(--color-navy-800)] px-5">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-brand)] text-white shadow-lg shadow-[var(--color-brand)]/20">
          <Layers className="h-5 w-5" />
        </span>
        <div>
          <Link href="/" className="font-bold text-white">
            DevFolio<span className="text-[var(--color-mint)]">AI</span>
          </Link>
          <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-muted)]">
            Dashboard
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {showAdmin ? (
          <Link
            href="/dashboard/admin"
            className={cn(
              "mb-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              pathname === "/dashboard/admin" || pathname.startsWith("/dashboard/admin/")
                ? "bg-amber-500/20 text-amber-100 ring-1 ring-amber-500/40"
                : "text-amber-200/80 hover:bg-amber-500/10 hover:text-amber-100",
            )}
          >
            <Shield className="h-5 w-5 shrink-0" />
            Admin console
          </Link>
        ) : null}
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                active
                  ? "bg-[var(--color-brand)]/25 text-white shadow-inner shadow-black/10"
                  : "text-[var(--color-muted)] hover:bg-[var(--color-navy-800)] hover:text-white",
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 shrink-0",
                  active ? "text-[var(--color-mint)]" : "text-[var(--color-brand-light)]",
                )}
              />
              {item.label}
              {active ? (
                <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[var(--color-mint)]" />
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-[var(--color-navy-800)] p-3">
        <Link
          href="/"
          className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-[var(--color-muted)] transition-colors hover:bg-[var(--color-navy-800)] hover:text-white"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to website
        </Link>
        <div className="rounded-xl bg-[var(--color-navy-950)]/80 p-3">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-mint-dark)] text-sm font-bold text-white">
              {initials}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{displayName}</p>
              <p className="truncate text-xs text-[var(--color-muted)]">{displayEmail}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-[var(--color-navy-700)] py-2 text-xs font-medium text-[var(--color-muted)] transition-colors hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}

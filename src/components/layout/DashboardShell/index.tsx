"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { AuthGuard } from "@/components/features/auth/AuthGuard";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import { cn } from "@/lib/helpers/cn";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="dashboard-shell flex min-h-screen bg-[var(--color-navy-950)]">
        <div
          className={cn(
            "fixed inset-0 z-40 bg-black/60 lg:hidden",
            mobileOpen ? "block" : "hidden",
          )}
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />

        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 lg:static lg:z-auto",
            mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
            "transition-transform duration-200 ease-out",
          )}
        >
          <DashboardSidebar />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="flex h-14 items-center gap-3 border-b border-[var(--color-navy-800)] bg-[var(--color-navy-900)]/80 px-4 backdrop-blur-md lg:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-lg p-2 text-[var(--color-muted)] hover:bg-[var(--color-navy-800)] hover:text-white"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <span className="text-sm font-semibold text-white">DevFolio AI</span>
          </header>

          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}

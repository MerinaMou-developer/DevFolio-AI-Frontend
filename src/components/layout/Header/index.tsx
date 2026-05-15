"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/helpers/cn";

const nav = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/tracker", label: "Jobs" },
  { href: "/dashboard/ai", label: "AI Studio" },
];

export function Header() {
  const pathname = usePathname();
  const { isAuthenticated, user, logout, isLoading } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] glass">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-brand)] text-white">
            <Layers className="h-4 w-4" />
          </span>
          <span className="text-white">
            DevFolio<span className="text-[var(--color-mint)]">AI</span>
          </span>
        </Link>

        {isAuthenticated ? (
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm transition-colors",
                  pathname === item.href || pathname.startsWith(`${item.href}/`)
                    ? "bg-[var(--color-brand)]/30 text-[var(--color-mint-bright)]"
                    : "text-[var(--color-muted)] hover:text-white",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        ) : null}

        <div className="flex items-center gap-2">
          {!isLoading && isAuthenticated ? (
            <>
              <span className="hidden text-sm text-[var(--color-muted)] sm:inline">
                {user?.email}
              </span>
              <Button variant="ghost" size="sm" onClick={logout}>
                Sign out
              </Button>
            </>
          ) : !isLoading ? (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}

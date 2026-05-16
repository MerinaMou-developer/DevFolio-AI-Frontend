"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/helpers/cn";

const marketingLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
];

export function MarketingHeader() {
  const pathname = usePathname();
  const { isAuthenticated, logout, isLoading } = useAuth();
  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        isHome
          ? "glass-light"
          : "border-b border-[var(--color-cyan-200)]/50 bg-white/90 backdrop-blur-md",
      )}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-brand)] text-white shadow-md shadow-[var(--color-brand)]/30 transition-transform group-hover:scale-105">
            <Layers className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-[var(--color-navy-900)]">
            DevFolio<span className="text-[var(--color-brand)]">AI</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {marketingLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition-colors hover:bg-[var(--color-cyan-100)]/50 hover:text-[var(--color-navy-900)]"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {!isLoading && isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" onClick={logout}>
                Sign out
              </Button>
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            </>
          ) : !isLoading ? (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="shadow-md">
                  Get started
                </Button>
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}

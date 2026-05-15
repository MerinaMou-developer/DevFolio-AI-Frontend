import Link from "next/link";
import { Layers } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="border-t border-[var(--color-navy-800)] bg-[var(--color-navy-950)] py-12 text-[var(--color-cyan-200)]/70">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-brand)] text-white">
                <Layers className="h-4 w-4" />
              </span>
              <span className="font-bold text-white">DevFolio AI</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed">
              AI-powered portfolio and job tracker for developers who take their careers seriously.
            </p>
          </div>

          <div className="flex gap-12 text-sm">
            <div>
              <p className="mb-3 font-semibold text-white">Product</p>
              <ul className="space-y-2">
                <li>
                  <Link href="/#features" className="hover:text-[var(--color-mint)]">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="hover:text-[var(--color-mint)]">
                    Sign up
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-semibold text-white">Company</p>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="hover:text-[var(--color-mint)]">
                    About
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-[var(--color-navy-800)] pt-8 text-center text-xs sm:text-left">
          <p>© {new Date().getFullYear()} DevFolio AI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

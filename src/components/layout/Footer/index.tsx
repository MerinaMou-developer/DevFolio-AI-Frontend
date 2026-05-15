import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-navy-950)] py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 text-sm text-[var(--color-muted)] sm:flex-row sm:px-6">
        <p>© {new Date().getFullYear()} DevFolio AI. Built for developers who ship.</p>
        <div className="flex gap-6">
          <Link href="/about" className="transition-colors hover:text-[var(--color-mint)]">
            About
          </Link>
          <Link href="/" className="transition-colors hover:text-[var(--color-mint)]">
            Home
          </Link>
        </div>
      </div>
    </footer>
  );
}

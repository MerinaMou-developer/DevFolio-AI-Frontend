const stack = ["Portfolio", "Job tracker", "AI insights", "Secure auth", "Public profiles"];

export function TrustBar() {
  return (
    <section className="border-y border-[var(--color-cyan-100)] bg-white/70 py-8 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="mb-5 text-center text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
          Production-ready stack
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {stack.map((name) => (
            <span
              key={name}
              className="text-sm font-semibold text-[var(--color-navy-800)]/70 transition-colors hover:text-[var(--color-brand)]"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  {
    step: "01",
    title: "Create your profile",
    description: "Add skills, links, avatar, and a custom portfolio slug. Toggle public when ready.",
  },
  {
    step: "02",
    title: "Track applications",
    description: "Log roles in a visual pipeline. Update status as you progress through interviews.",
  },
  {
    step: "03",
    title: "Let AI guide you",
    description: "Analyze your resume and match jobs with scores, gaps, and recommended next steps.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="border-t border-[var(--color-cyan-100)] bg-[var(--color-cyan-50)]/50 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-brand)]">
            How it works
          </p>
          <h2 className="mt-3 text-3xl font-bold text-[var(--color-navy-900)] sm:text-4xl">
            Up and running in three steps
          </h2>
        </div>

        <ol className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((item, index) => (
            <li key={item.step} className="relative">
              {index < steps.length - 1 ? (
                <span
                  className="absolute right-0 top-10 hidden h-px w-full translate-x-1/2 bg-gradient-to-r from-[var(--color-brand)]/40 to-transparent md:block"
                  aria-hidden
                />
              ) : null}
              <div className="rounded-2xl border border-white bg-white/80 p-8 shadow-sm backdrop-blur-sm">
                <span className="text-4xl font-black text-[var(--color-cyan-200)]">
                  {item.step}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-[var(--color-navy-900)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

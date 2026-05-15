import { Briefcase, Brain, Globe, Shield, Target, Zap } from "lucide-react";

const features = [
  {
    icon: Globe,
    title: "Public portfolio",
    description:
      "SEO-friendly profile pages with skills, social links, and resume download — share one memorable slug.",
    accent: "from-[var(--color-brand)]/10 to-transparent",
  },
  {
    icon: Briefcase,
    title: "Job tracker",
    description:
      "Kanban pipeline from applied to offer. Search, filter, and never miss a follow-up again.",
    accent: "from-[var(--color-mint)]/10 to-transparent",
  },
  {
    icon: Brain,
    title: "AI career studio",
    description:
      "Resume scoring and job-match analysis with actionable feedback — quota-aware and provider-agnostic.",
    accent: "from-[var(--color-cyan-200)]/40 to-transparent",
  },
  {
    icon: Target,
    title: "Built for hiring",
    description:
      "JWT auth, typed API client, App Router structure — patterns recruiters and engineers recognize.",
    accent: "from-[var(--color-brand)]/10 to-transparent",
  },
  {
    icon: Shield,
    title: "Secure by design",
    description:
      "Refresh tokens, role-based access, and validated inputs on every endpoint your UI calls.",
    accent: "from-[var(--color-navy-800)]/5 to-transparent",
  },
  {
    icon: Zap,
    title: "Fast & scalable",
    description:
      "Built to stay fast as you add more applications, analyses, and portfolio visitors.",
    accent: "from-[var(--color-mint)]/10 to-transparent",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="bg-white py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[var(--color-brand)]">
            Features
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-navy-900)] sm:text-4xl">
            Everything you need to run your job search
          </h2>
          <p className="mt-4 text-lg text-[var(--color-text-secondary)]">
            From first application to signed offer — one cohesive workspace for modern developers.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <article
              key={f.title}
              className="group relative overflow-hidden rounded-2xl border border-[var(--color-cyan-100)] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[var(--color-brand)]/30 hover:shadow-lg hover:shadow-[var(--color-brand)]/10"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${f.accent} opacity-0 transition-opacity group-hover:opacity-100`}
              />
              <div className="relative">
                <span className="inline-flex rounded-xl bg-[var(--color-brand)]/10 p-3 text-[var(--color-brand)] transition-colors group-hover:bg-[var(--color-brand)] group-hover:text-white">
                  <f.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 text-lg font-semibold text-[var(--color-navy-900)]">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">
                  {f.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

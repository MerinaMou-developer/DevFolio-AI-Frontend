import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description: "About DevFolio AI — AI-powered portfolio and job tracker for developers.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <h1 className="mb-2 text-3xl font-bold text-[var(--color-navy-900)]">About DevFolio AI</h1>
      <p className="mb-8 text-[var(--color-text-secondary)]">
        A real product for developers who want more than a static resume page.
      </p>
      <article className="rounded-2xl border border-[var(--color-cyan-100)] bg-white p-8 shadow-lg">
        <h2 className="text-xl font-semibold text-[var(--color-navy-900)]">
          One platform for your developer career
        </h2>
        <div className="mt-4 space-y-4 leading-relaxed text-[var(--color-text-secondary)]">
          <p>
            DevFolio AI helps developers showcase their work, track job applications, and get
            AI-powered feedback on resumes and job fit — so you can apply with confidence.
          </p>
          <p>
            Built with Next.js App Router, TypeScript, and a scalable folder structure that scales
            from side project to portfolio centerpiece.
          </p>
        </div>
      </article>
    </div>
  );
}

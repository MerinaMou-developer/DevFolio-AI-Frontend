"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Globe,
  Sparkles,
  TrendingUp,
  User,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { listApplications } from "@/lib/api/tracker";
import { getMyProfile } from "@/lib/api/profile";
import { listAnalyses } from "@/lib/api/ai";
import { STATUS_LABELS } from "@/lib/constants/config";
import type { Profile } from "@/types/profile.types";
import type { JobApplication } from "@/types/tracker.types";

export default function DashboardPage() {
  const { getToken, user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [analysisCount, setAnalysisCount] = useState(0);

  useEffect(() => {
    async function load() {
      const token = await getToken();
      if (!token) return;
      const [p, jobData, analyses] = await Promise.all([
        getMyProfile(token),
        listApplications(token, { page_size: 100 }),
        listAnalyses(token, { page: 1 }),
      ]);
      setProfile(p);
      setJobs(jobData.items);
      setAnalysisCount(analyses.total);
    }
    load();
  }, [getToken]);

  const activeInterviews = useMemo(
    () => jobs.filter((j) => j.status === "interview" || j.status === "screening").length,
    [jobs],
  );

  const offers = useMemo(() => jobs.filter((j) => j.status === "offer").length, [jobs]);

  const profileComplete = useMemo(() => {
    if (!profile) return 0;
    const fields = [
      profile.name,
      profile.bio,
      profile.job_title,
      profile.skills.length > 0,
      profile.resume_url,
      profile.portfolio_slug,
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [profile]);

  const quickLinks = [
    {
      href: "/dashboard/profile",
      icon: User,
      title: "Edit profile",
      desc: "Avatar, resume, skills & public slug",
    },
    {
      href: "/dashboard/tracker",
      icon: Briefcase,
      title: "Add application",
      desc: "Track a new role in your pipeline",
    },
    {
      href: "/dashboard/ai",
      icon: Sparkles,
      title: "Run AI analysis",
      desc: "Resume score or job match",
    },
  ];

  const recentJobs = jobs.slice(0, 4);

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title={`Welcome back${user?.email ? `, ${user.email.split("@")[0]}` : ""}`}
        description="Your career command center — portfolio, applications, and AI insights in one place."
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Applications" value={jobs.length} hint="Total tracked roles" icon={Briefcase} />
        <StatCard
          label="In progress"
          value={activeInterviews}
          hint="Screening & interview"
          icon={TrendingUp}
        />
        <StatCard label="Offers" value={offers} hint="Celebrate wins" icon={CheckCircle2} />
        <StatCard
          label="AI analyses"
          value={analysisCount}
          hint="Tap to view history"
          icon={Sparkles}
          href="/dashboard/ai#history"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <section className="rounded-2xl border border-[var(--color-navy-800)] bg-[var(--color-card)] p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">
              Quick actions
            </h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {quickLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group rounded-xl border border-[var(--color-navy-800)] bg-[var(--color-navy-950)]/50 p-4 transition-all hover:border-[var(--color-brand)]/40 hover:bg-[var(--color-brand)]/5"
                >
                  <link.icon className="mb-3 h-5 w-5 text-[var(--color-mint)]" />
                  <p className="font-medium text-white">{link.title}</p>
                  <p className="mt-1 text-xs text-[var(--color-muted)]">{link.desc}</p>
                  <ArrowRight className="mt-3 h-4 w-4 text-[var(--color-brand)] opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--color-navy-800)] bg-[var(--color-card)] p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted)]">
                Recent applications
              </h2>
              <Link href="/dashboard/tracker">
                <Button variant="ghost-dark" size="sm">
                  View all
                </Button>
              </Link>
            </div>
            {recentJobs.length === 0 ? (
              <p className="mt-6 text-sm text-[var(--color-muted)]">
                No applications yet.{" "}
                <Link href="/dashboard/tracker" className="text-[var(--color-mint)] hover:underline">
                  Add your first role
                </Link>
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-[var(--color-navy-800)]">
                {recentJobs.map((job) => (
                  <li key={job.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-white">{job.role_title}</p>
                      <p className="text-sm text-[var(--color-muted)]">{job.company_name}</p>
                    </div>
                    <span className="rounded-full border border-[var(--color-brand)]/30 bg-[var(--color-brand)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--color-brand-light)]">
                      {STATUS_LABELS[job.status]}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-[var(--color-navy-800)] bg-gradient-to-br from-[var(--color-brand)]/20 to-[var(--color-card)] p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-mint)]">
              Profile strength
            </p>
            <p className="mt-2 text-4xl font-bold text-white">{profileComplete}%</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-[var(--color-navy-950)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-mint)] transition-all"
                style={{ width: `${profileComplete}%` }}
              />
            </div>
            <p className="mt-3 text-sm text-[var(--color-muted)]">
              Complete your profile and upload a resume to unlock full AI insights.
            </p>
            <Link href="/dashboard/profile" className="mt-4 inline-block">
              <Button variant="secondary" size="sm">
                Complete profile
              </Button>
            </Link>
          </section>

          {profile?.is_public && profile.portfolio_slug ? (
            <section className="rounded-2xl border border-[var(--color-mint)]/30 bg-[var(--color-mint)]/5 p-6">
              <div className="flex items-start gap-3">
                <Globe className="h-5 w-5 shrink-0 text-[var(--color-mint)]" />
                <div>
                  <p className="font-medium text-white">Portfolio is live</p>
                  <p className="mt-1 text-sm text-[var(--color-muted)]">
                    Share your public page with recruiters.
                  </p>
                  <Link
                    href={`/portfolio/${profile.portfolio_slug}`}
                    target="_blank"
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[var(--color-mint)] hover:underline"
                  >
                    /portfolio/{profile.portfolio_slug}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            </section>
          ) : (
            <section className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6">
              <p className="font-medium text-amber-200">Portfolio not public yet</p>
              <p className="mt-1 text-sm text-[var(--color-muted)]">
                Set a slug and enable visibility in profile settings.
              </p>
              <Link href="/dashboard/profile" className="mt-3 inline-block">
                <Button variant="ghost-dark" size="sm">
                  Go to profile
                </Button>
              </Link>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}

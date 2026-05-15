import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Github, Globe, Linkedin, MapPin } from "lucide-react";
import { getPublicProfile } from "@/lib/api/profile";
import { mediaUrl } from "@/lib/api/client";
import { ApiClientError } from "@/lib/api/client";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const profile = await getPublicProfile(slug);
    return {
      title: profile.name || slug,
      description: profile.bio || `Developer portfolio — ${profile.job_title || slug}`,
    };
  } catch {
    return { title: "Portfolio not found" };
  }
}

export default async function PublicPortfolioPage({ params }: PageProps) {
  const { slug } = await params;

  let profile;
  try {
    profile = await getPublicProfile(slug);
  } catch (err) {
    if (err instanceof ApiClientError && err.status === 404) notFound();
    throw err;
  }

  const avatarSrc = mediaUrl(profile.avatar_url);
  const resumeSrc = mediaUrl(profile.resume_url);

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <article className="glass animate-fade-up rounded-2xl p-8 sm:p-12">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
          <div className="relative mb-6 h-28 w-28 shrink-0 overflow-hidden rounded-2xl border border-zinc-700 bg-zinc-900 sm:mb-0 sm:mr-8">
            {avatarSrc ? (
              <Image src={avatarSrc} alt={profile.name || "Avatar"} fill className="object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-4xl font-bold text-violet-500/50">
                {(profile.name || "?")[0]}
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-zinc-50">{profile.name || slug}</h1>
            {profile.job_title ? (
              <p className="mt-1 text-lg text-violet-300">{profile.job_title}</p>
            ) : null}
            {profile.location ? (
              <p className="mt-2 flex items-center justify-center gap-1 text-sm text-zinc-400 sm:justify-start">
                <MapPin className="h-4 w-4" />
                {profile.location}
              </p>
            ) : null}
            <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
              {profile.github_url ? (
                <SocialLink href={profile.github_url} icon={Github} label="GitHub" />
              ) : null}
              {profile.linkedin_url ? (
                <SocialLink href={profile.linkedin_url} icon={Linkedin} label="LinkedIn" />
              ) : null}
              {profile.website_url ? (
                <SocialLink href={profile.website_url} icon={Globe} label="Website" />
              ) : null}
            </div>
          </div>
        </div>

        {profile.bio ? (
          <p className="mt-8 text-center text-zinc-300 leading-relaxed sm:text-left">
            {profile.bio}
          </p>
        ) : null}

        {profile.skills.length > 0 ? (
          <div className="mt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-zinc-500">
              Skills
            </h2>
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              {profile.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-sm text-violet-200"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {resumeSrc ? (
          <div className="mt-10 text-center sm:text-left">
            <a
              href={resumeSrc}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-lg bg-violet-600 px-6 py-3 text-sm font-medium text-white hover:bg-violet-500"
            >
              Download resume
            </a>
          </div>
        ) : null}

        <p className="mt-12 text-center text-xs text-zinc-600">
          Built with{" "}
          <Link href="/" className="text-violet-500/80 hover:underline">
            DevFolio AI
          </Link>
        </p>
      </article>
    </div>
  );
}

function SocialLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: typeof Github;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-lg border border-zinc-700 px-3 py-2 text-sm text-zinc-300 transition-colors hover:border-violet-500/50 hover:text-violet-300"
    >
      <Icon className="h-4 w-4" />
      {label}
    </a>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { ExternalLink, FileText, Trash2, Upload } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/context/AuthContext";
import {
  deleteResume,
  getMyProfile,
  updateMyProfile,
  uploadAvatar,
  uploadResume,
} from "@/lib/api/profile";
import { mediaUrl, ApiClientError } from "@/lib/api/client";
import type { Profile } from "@/types/profile.types";

type FormState = {
  name: string;
  bio: string;
  job_title: string;
  location: string;
  github_url: string;
  linkedin_url: string;
  website_url: string;
  portfolio_slug: string;
  is_public: boolean;
};

function profileToForm(p: Profile): FormState {
  return {
    name: p.name ?? "",
    bio: p.bio ?? "",
    job_title: p.job_title ?? "",
    location: p.location ?? "",
    github_url: p.github_url ?? "",
    linkedin_url: p.linkedin_url ?? "",
    website_url: p.website_url ?? "",
    portfolio_slug: p.portfolio_slug ?? "",
    is_public: p.is_public,
  };
}

export default function ProfilePage() {
  const { getToken } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<FormState | null>(null);
  const [skillsText, setSkillsText] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<"avatar" | "resume" | null>(null);
  const avatarRef = useRef<HTMLInputElement>(null);
  const resumeRef = useRef<HTMLInputElement>(null);

  const loadProfile = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    const p = await getMyProfile(token);
    setProfile(p);
    setForm(profileToForm(p));
    setSkillsText(p.skills.join(", "));
  }, [getToken]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    const token = await getToken();
    if (!token) return;
    setSaving(true);
    setError("");
    setMessage("");
    const skills = skillsText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    try {
      const updated = await updateMyProfile(token, {
        name: form.name || null,
        bio: form.bio || null,
        job_title: form.job_title || null,
        location: form.location || null,
        github_url: form.github_url || null,
        linkedin_url: form.linkedin_url || null,
        website_url: form.website_url || null,
        portfolio_slug: form.portfolio_slug || undefined,
        is_public: form.is_public,
        skills,
      });
      setProfile(updated);
      setForm(profileToForm(updated));
      setMessage("Profile saved successfully.");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleFileUpload(type: "avatar" | "resume", file: File) {
    const token = await getToken();
    if (!token) return;
    setUploading(type);
    setError("");
    setMessage("");
    try {
      if (type === "avatar") {
        await uploadAvatar(token, file);
      } else {
        if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
          setError("Resume must be a PDF file.");
          return;
        }
        await uploadResume(token, file);
      }
      await loadProfile();
      setMessage(`${type === "avatar" ? "Avatar" : "Resume"} uploaded successfully.`);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Upload failed");
    } finally {
      setUploading(null);
      if (type === "avatar" && avatarRef.current) avatarRef.current.value = "";
      if (type === "resume" && resumeRef.current) resumeRef.current.value = "";
    }
  }

  async function handleRemoveResume() {
    if (!confirm("Remove your uploaded resume?")) return;
    const token = await getToken();
    if (!token) return;
    setUploading("resume");
    setError("");
    try {
      const updated = await deleteResume(token);
      setProfile(updated);
      setForm(profileToForm(updated));
      setMessage("Resume removed.");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Could not remove resume");
    } finally {
      setUploading(null);
    }
  }

  if (!profile || !form) {
    return (
      <div className="flex justify-center py-20">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-brand)]/30 border-t-[var(--color-brand)]" />
      </div>
    );
  }

  const avatarSrc = mediaUrl(profile.avatar_url);
  const resumeSrc = mediaUrl(profile.resume_url);
  const resumeFileName = profile.resume_url?.split("/").pop() ?? "resume.pdf";

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="Profile"
        description="Manage your public portfolio, avatar, and resume for AI analysis."
      />

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
        </CardHeader>
        <div className="flex flex-wrap items-center gap-6">
          <div className="relative h-24 w-24 overflow-hidden rounded-full border border-zinc-700 bg-zinc-900">
            {avatarSrc ? (
              <Image src={avatarSrc} alt="Avatar" fill className="object-cover" unoptimized />
            ) : (
              <div className="flex h-full items-center justify-center text-3xl text-zinc-600">
                ?
              </div>
            )}
          </div>
          <div>
            <input
              ref={avatarRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFileUpload("avatar", f);
              }}
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              isLoading={uploading === "avatar"}
              onClick={() => avatarRef.current?.click()}
            >
              <Upload className="h-4 w-4" />
              Upload photo
            </Button>
            <p className="mt-2 text-xs text-zinc-500">JPG, PNG or WebP · max 5 MB</p>
          </div>
        </div>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Resume (PDF)</CardTitle>
          <p className="text-sm text-zinc-400">
            Used for public download and AI resume analysis in AI Studio.
          </p>
        </CardHeader>

        <input
          ref={resumeRef}
          type="file"
          accept="application/pdf,.pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFileUpload("resume", f);
          }}
        />

        {profile.resume_url ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 rounded-xl border border-[var(--color-brand)]/30 bg-[var(--color-brand)]/10 px-4 py-3">
              <FileText className="h-8 w-8 shrink-0 text-[var(--color-mint)]" />
              <div>
                <p className="font-medium text-zinc-100">{resumeFileName}</p>
                <p className="text-xs text-zinc-400">Ready for AI analysis</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={resumeSrc || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button type="button" variant="secondary" size="sm">
                  <ExternalLink className="h-4 w-4" />
                  View PDF
                </Button>
              </a>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                isLoading={uploading === "resume"}
                onClick={() => resumeRef.current?.click()}
              >
                <Upload className="h-4 w-4" />
                Replace
              </Button>
              <Button
                type="button"
                variant="danger"
                size="sm"
                disabled={uploading === "resume"}
                onClick={handleRemoveResume}
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={uploading === "resume"}
            onClick={() => resumeRef.current?.click()}
            className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-600 bg-zinc-900/50 px-6 py-10 text-center transition-colors hover:border-[var(--color-brand)] hover:bg-[var(--color-brand)]/5 disabled:opacity-50"
          >
            {uploading === "resume" ? (
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-brand)]/30 border-t-[var(--color-brand)]" />
            ) : (
              <>
                <Upload className="mb-3 h-10 w-10 text-[var(--color-mint)]" />
                <span className="font-medium text-zinc-200">Upload resume PDF</span>
                <span className="mt-1 text-sm text-zinc-500">Click to browse · max 10 MB</span>
              </>
            )}
          </button>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile details</CardTitle>
        </CardHeader>
        <form onSubmit={handleSave} className="space-y-4">
          <Input
            tone="dark"
            label="Full name"
            value={form.name}
            onChange={(e) => updateField("name", e.target.value)}
          />
          <Input
            tone="dark"
            label="Job title"
            value={form.job_title}
            onChange={(e) => updateField("job_title", e.target.value)}
          />
          <Input
            tone="dark"
            label="Location"
            value={form.location}
            onChange={(e) => updateField("location", e.target.value)}
          />
          <Textarea
            tone="dark"
            label="Bio"
            value={form.bio}
            onChange={(e) => updateField("bio", e.target.value)}
            rows={4}
          />
          <Input
            tone="dark"
            label="Portfolio slug"
            value={form.portfolio_slug}
            onChange={(e) => updateField("portfolio_slug", e.target.value)}
            pattern="[a-z0-9][a-z0-9-]{1,48}[a-z0-9]"
          />
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <input
              type="checkbox"
              checked={form.is_public}
              onChange={(e) => updateField("is_public", e.target.checked)}
              className="rounded border-zinc-600"
            />
            Make portfolio public
          </label>
          {form.is_public && form.portfolio_slug ? (
            <Link
              href={`/portfolio/${form.portfolio_slug}`}
              className="block text-sm text-[var(--color-mint)] hover:underline"
              target="_blank"
            >
              Preview public portfolio →
            </Link>
          ) : null}
          <Input
            tone="dark"
            label="GitHub URL"
            value={form.github_url}
            onChange={(e) => updateField("github_url", e.target.value)}
          />
          <Input
            tone="dark"
            label="LinkedIn URL"
            value={form.linkedin_url}
            onChange={(e) => updateField("linkedin_url", e.target.value)}
          />
          <Input
            tone="dark"
            label="Website"
            value={form.website_url}
            onChange={(e) => updateField("website_url", e.target.value)}
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium text-zinc-300">
              Skills (comma-separated)
            </label>
            <Input tone="dark" value={skillsText} onChange={(e) => setSkillsText(e.target.value)} />
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-400">{message}</p> : null}
          <Button type="submit" isLoading={saving}>
            Save profile
          </Button>
        </form>
      </Card>
    </div>
  );
}

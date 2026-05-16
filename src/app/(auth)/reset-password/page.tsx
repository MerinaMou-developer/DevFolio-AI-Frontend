"use client";

import Link from "next/link";
import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { AuthFormLayout } from "@/components/features/auth/AuthFormLayout";
import { AuthLoadingSpinner } from "@/components/features/auth/AuthLoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useGuestOnly } from "@/hooks/useGuestOnly";
import { resetPassword } from "@/lib/api/auth";
import { ApiClientError } from "@/lib/api/client";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token")?.trim() ?? "";
  const { showLoading } = useGuestOnly();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  if (showLoading) {
    return <AuthLoadingSpinner />;
  }

  if (!token) {
    return (
      <AuthFormLayout
        title="Invalid reset link"
        description="This link is missing or malformed. Request a new password reset email."
        footer={
          <p className="text-center text-sm text-zinc-500">
            <Link href="/forgot-password" className="text-violet-400 hover:underline">
              Request new link
            </Link>
          </p>
        }
      >
        <p className="text-sm text-[var(--color-text-secondary)]">
          Open the full link from your email, or paste the token into the URL as{" "}
          <code className="rounded bg-zinc-100 px-1 text-xs">?token=...</code>
        </p>
      </AuthFormLayout>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(() => router.push("/login"), 2500);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Reset failed");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <AuthFormLayout
        title="Password updated"
        description="You can now sign in with your new password."
        footer={
          <p className="text-center text-sm text-zinc-500">
            <Link href="/login" className="text-violet-400 hover:underline">
              Go to sign in
            </Link>
          </p>
        }
      >
        <div className="flex flex-col items-center gap-3 py-4">
          <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          <p className="text-sm text-[var(--color-text-secondary)]">Redirecting to login…</p>
        </div>
      </AuthFormLayout>
    );
  }

  return (
    <AuthFormLayout
      title="Set a new password"
      description="Choose a strong password you have not used on this site before."
      footer={
        <p className="text-center text-sm text-zinc-500">
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-1 text-violet-400 hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="New password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        {error ? <p className="text-sm text-red-500">{error}</p> : null}
        <Button type="submit" className="w-full" isLoading={loading}>
          Update password
        </Button>
      </form>
    </AuthFormLayout>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<AuthLoadingSpinner />}>
      <ResetPasswordForm />
    </Suspense>
  );
}

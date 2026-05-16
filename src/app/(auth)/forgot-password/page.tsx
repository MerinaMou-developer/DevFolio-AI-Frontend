"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Mail, ArrowLeft } from "lucide-react";
import { AuthFormLayout } from "@/components/features/auth/AuthFormLayout";
import { AuthLoadingSpinner } from "@/components/features/auth/AuthLoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useGuestOnly } from "@/hooks/useGuestOnly";
import { forgotPassword } from "@/lib/api/auth";
import { ApiClientError } from "@/lib/api/client";

export default function ForgotPasswordPage() {
  const { showLoading } = useGuestOnly();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  if (showLoading) {
    return <AuthLoadingSpinner />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email.trim());
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFormLayout
      title={sent ? "Check your email" : "Forgot password?"}
      description={
        sent
          ? "If an account exists for that address, we sent a reset link. The link expires in 60 minutes."
          : "Enter your account email and we will send you a reset link."
      }
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
      {sent ? (
        <div className="flex flex-col items-center gap-4 py-4 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand)]">
            <Mail className="h-7 w-7" />
          </span>
          <p className="text-sm text-[var(--color-text-secondary)]">
            We sent a message to <strong className="text-[var(--color-navy-900)]">{email}</strong>.
            Check your inbox and spam folder.
          </p>
          <Button variant="outline" className="w-full" onClick={() => setSent(false)}>
            Send again
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <Button type="submit" className="w-full" isLoading={loading}>
            Send reset link
          </Button>
        </form>
      )}
    </AuthFormLayout>
  );
}

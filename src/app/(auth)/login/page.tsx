"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { GoogleSignInButton } from "@/components/features/auth/GoogleSignInButton";
import { AuthLoadingSpinner } from "@/components/features/auth/AuthLoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { useGuestOnly } from "@/hooks/useGuestOnly";
import { ApiClientError } from "@/lib/api/client";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showLoading } = useGuestOnly();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (showLoading) {
    return <AuthLoadingSpinner />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const me = await login(email, password);
      router.push(me.role === "admin" ? "/dashboard/admin" : "/dashboard");
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <Card className="border-[var(--color-cyan-100)] bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-[var(--color-navy-900)]">Welcome back</CardTitle>
          <p className="text-sm text-[var(--color-text-secondary)]">Sign in to your DevFolio account</p>
        </CardHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="space-y-1.5">
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-right">
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-violet-400 hover:underline"
              >
                Forgot password?
              </Link>
            </p>
          </div>
          {error ? <p className="text-sm text-red-500">{error}</p> : null}
          <Button type="submit" className="w-full" isLoading={loading}>
            Sign in
          </Button>
        </form>
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-200" />
          <span className="text-xs text-zinc-500">or</span>
          <div className="h-px flex-1 bg-zinc-200" />
        </div>
        <GoogleSignInButton onError={setError} />
        <p className="mt-6 text-center text-sm text-zinc-500">
          No account?{" "}
          <Link href="/register" className="text-violet-400 hover:underline">
            Register
          </Link>
        </p>
      </Card>
    </div>
  );
}

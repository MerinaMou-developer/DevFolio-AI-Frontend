"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useState } from "react";
import { GoogleSignInButton } from "@/components/features/auth/GoogleSignInButton";
import { AuthLoadingSpinner } from "@/components/features/auth/AuthLoadingSpinner";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";
import { ApiClientError } from "@/lib/api/client";
import {
  BILLING_REDIRECT,
  loginHref,
  resolvePostAuthPath,
} from "@/lib/helpers/authRedirect";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const { register, login, isAuthenticated, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(resolvePostAuthPath("developer", redirectParam));
    }
  }, [isAuthenticated, isLoading, router, redirectParam]);

  if (isLoading || isAuthenticated) {
    return <AuthLoadingSpinner />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(email, password);
      const me = await login(email, password);
      router.push(resolvePostAuthPath(me.role, redirectParam));
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  const subheading =
    redirectParam === BILLING_REDIRECT
      ? "Create an account, then continue to Pro checkout."
      : "Start building your developer portfolio";

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-16">
      <Card className="border-[var(--color-cyan-100)] bg-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-[var(--color-navy-900)]">Create your account</CardTitle>
          <p className="text-sm text-[var(--color-text-secondary)]">{subheading}</p>
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
          <Input
            label="Password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <Button type="submit" className="w-full" isLoading={loading}>
            Create account
          </Button>
        </form>
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-zinc-200" />
          <span className="text-xs text-zinc-500">or</span>
          <div className="h-px flex-1 bg-zinc-200" />
        </div>
        <GoogleSignInButton onError={setError} redirectParam={redirectParam} />
        <p className="mt-6 text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link
            href={loginHref(redirectParam ?? undefined)}
            className="text-violet-400 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </Card>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<AuthLoadingSpinner />}>
      <RegisterForm />
    </Suspense>
  );
}

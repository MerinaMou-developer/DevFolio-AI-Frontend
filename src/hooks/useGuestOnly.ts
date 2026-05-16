"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useMounted } from "@/hooks/useMounted";

/** Redirect authenticated users away from login/register/forgot-password pages. */
export function useGuestOnly(redirectTo = "/dashboard") {
  const mounted = useMounted();
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (mounted && !isLoading && isAuthenticated) {
      router.replace(redirectTo);
    }
  }, [mounted, isLoading, isAuthenticated, redirectTo, router]);

  const showLoading = !mounted || isLoading;
  return { showLoading, isAuthenticated };
}

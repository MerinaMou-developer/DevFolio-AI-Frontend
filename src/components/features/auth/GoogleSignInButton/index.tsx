"use client";

import Script from "next/script";
import { useCallback, useEffect, useState } from "react";
import { useMounted } from "@/hooks/useMounted";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/context/AuthContext";
import { GOOGLE_CLIENT_ID } from "@/lib/constants/config";
import { ApiClientError } from "@/lib/api/client";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void;
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface GoogleSignInButtonProps {
  onError?: (message: string) => void;
}

export function GoogleSignInButton({ onError }: GoogleSignInButtonProps) {
  const { googleLogin } = useAuth();
  const mounted = useMounted();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const buttonRef = useCallback((node: HTMLDivElement | null) => {
    if (!node || !ready || !GOOGLE_CLIENT_ID || !window.google) return;
    node.innerHTML = "";
    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: async (response: { credential?: string }) => {
        if (!response.credential) return;
        setLoading(true);
        try {
          await googleLogin(response.credential);
        } catch (err) {
          const msg =
            err instanceof ApiClientError ? err.message : "Google sign-in failed";
          onError?.(msg);
        } finally {
          setLoading(false);
        }
      },
    });
    window.google.accounts.id.renderButton(node, {
      theme: "filled_black",
      size: "large",
      width: 320,
      text: "continue_with",
    });
  }, [ready, googleLogin, onError]);

  useEffect(() => {
    if (window.google?.accounts?.id) setReady(true);
  }, []);

  if (!GOOGLE_CLIENT_ID) {
    return (
      <p className="text-center text-xs text-zinc-500">
        Set <code className="text-violet-400">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> to enable
        Google sign-in.
      </p>
    );
  }

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setReady(true)}
      />
      <div className="flex flex-col items-center gap-3">
        {mounted ? (
          <div ref={buttonRef} className={loading ? "pointer-events-none opacity-50" : ""} />
        ) : (
          <Button variant="secondary" disabled className="w-full max-w-xs">
            Loading Google…
          </Button>
        )}
      </div>
    </>
  );
}

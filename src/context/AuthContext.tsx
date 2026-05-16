"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getMe, login as apiLogin, register as apiRegister, googleSignIn } from "@/lib/api/auth";
import { ApiClientError, refreshAccessToken } from "@/lib/api/client";
import { clearTokens, getStoredTokens, storeTokens } from "@/lib/helpers/tokens";
import type { TokenResponse, User } from "@/types/api.types";

interface AuthContextValue {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string) => Promise<void>;
  googleLogin: (idToken: string) => Promise<void>;
  logout: () => void;
  getToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tokens, setTokens] = useState<TokenResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const applyTokens = useCallback(async (next: TokenResponse) => {
    storeTokens(next);
    setTokens(next);
    const me = await getMe(next.access_token);
    setUser(me);
  }, []);

  const bootstrap = useCallback(async () => {
    const stored = getStoredTokens();
    if (!stored?.access_token) {
      setIsLoading(false);
      return;
    }
    try {
      const me = await getMe(stored.access_token);
      setTokens(stored);
      setUser(me);
    } catch (err) {
      if (err instanceof ApiClientError && err.status === 401 && stored.refresh_token) {
        try {
          const refreshed = await refreshAccessToken(stored.refresh_token);
          await applyTokens(refreshed);
        } catch {
          clearTokens();
        }
      } else {
        clearTokens();
      }
    } finally {
      setIsLoading(false);
    }
  }, [applyTokens]);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  const login = useCallback(
    async (email: string, password: string) => {
      const next = await apiLogin(email, password);
      await applyTokens(next);
      const me = await getMe(next.access_token);
      setUser(me);
      return me;
    },
    [applyTokens],
  );

  const register = useCallback(async (email: string, password: string) => {
    await apiRegister(email, password);
  }, []);

  const googleLogin = useCallback(
    async (idToken: string) => {
      const next = await googleSignIn(idToken);
      await applyTokens(next);
    },
    [applyTokens],
  );

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    setTokens(null);
  }, []);

  const getToken = useCallback(async (): Promise<string | null> => {
    if (!tokens?.access_token) return null;
    try {
      return tokens.access_token;
    } catch (err) {
      if (
        err instanceof ApiClientError &&
        err.status === 401 &&
        tokens.refresh_token
      ) {
        const refreshed = await refreshAccessToken(tokens.refresh_token);
        await applyTokens(refreshed);
        return refreshed.access_token;
      }
      logout();
      return null;
    }
  }, [tokens, applyTokens, logout]);

  const value = useMemo(
    () => ({
      user,
      accessToken: tokens?.access_token ?? null,
      isLoading,
      isAuthenticated: !!user,
      login,
      register,
      googleLogin,
      logout,
      getToken,
    }),
    [user, tokens, isLoading, login, register, googleLogin, logout, getToken],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

import { TOKEN_STORAGE_KEY } from "@/lib/constants/config";
import type { TokenResponse } from "@/types/api.types";

export function getStoredTokens(): TokenResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TokenResponse;
  } catch {
    return null;
  }
}

export function storeTokens(tokens: TokenResponse) {
  localStorage.setItem(TOKEN_STORAGE_KEY, JSON.stringify(tokens));
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
}

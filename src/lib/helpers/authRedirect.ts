/** Safe internal redirects after login/register (no open redirects). */

const DEFAULT_AFTER_AUTH = "/dashboard";

export function getSafeRedirect(param: string | null | undefined): string {
  if (!param || typeof param !== "string") return DEFAULT_AFTER_AUTH;
  const path = param.trim();
  if (!path.startsWith("/") || path.startsWith("//")) return DEFAULT_AFTER_AUTH;
  if (path === "/dashboard" || path.startsWith("/dashboard/")) return path;
  return DEFAULT_AFTER_AUTH;
}

export function resolvePostAuthPath(
  role: string,
  redirectParam: string | null | undefined,
): string {
  const target = getSafeRedirect(redirectParam);
  if (target !== DEFAULT_AFTER_AUTH) return target;
  return role === "admin" ? "/dashboard/admin" : DEFAULT_AFTER_AUTH;
}

export function loginHref(redirect?: string): string {
  if (redirect) {
    return `/login?redirect=${encodeURIComponent(redirect)}`;
  }
  return "/login";
}

export function registerHref(redirect?: string): string {
  if (redirect) {
    return `/register?redirect=${encodeURIComponent(redirect)}`;
  }
  return "/register";
}

export const BILLING_REDIRECT = "/dashboard/billing";

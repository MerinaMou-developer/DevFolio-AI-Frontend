import { apiRequest } from "@/lib/api/client";
import type { BillingConfig, BillingStatus, CheckoutSession } from "@/types/billing.types";

export function getBillingConfig() {
  return apiRequest<BillingConfig>("/billing/config", { skipAuth: true });
}

export function getBillingStatus(token: string) {
  return apiRequest<BillingStatus>("/billing/status", { token });
}

export function createCheckoutSession(token: string) {
  return apiRequest<CheckoutSession>("/billing/checkout", {
    method: "POST",
    token,
  });
}

export function confirmCheckoutSession(token: string, sessionId: string) {
  return apiRequest<BillingStatus>("/billing/confirm-checkout", {
    method: "POST",
    token,
    body: JSON.stringify({ session_id: sessionId }),
  });
}

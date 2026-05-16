export interface BillingConfig {
  configured: boolean;
  publishable_key: string;
  pro_price_label: string;
  free_daily_ai_quota: number;
  pro_daily_ai_quota: number;
}

export interface BillingStatus {
  plan: string;
  daily_ai_quota: number;
  stripe_customer_id: string | null;
}

export interface CheckoutSession {
  checkout_url: string;
}

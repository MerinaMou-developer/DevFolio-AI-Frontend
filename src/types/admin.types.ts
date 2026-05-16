import type { Page } from "@/types/api.types";

export interface AdminStats {
  total_users: number;
  active_users: number;
  admin_users: number;
  pro_users: number;
  free_users: number;
  pro_monthly_total_cents: number;
  pro_monthly_currency: string | null;
  total_profiles: number;
  public_profiles: number;
  total_applications: number;
  total_ai_analyses: number;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  plan: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan_amount_cents: number | null;
  plan_currency: string | null;
  plan_interval: string | null;
  pro_since: string | null;
  is_active: boolean;
  created_at: string;
}

export interface AdminUserDetail extends AdminUser {
  application_count: number;
  analysis_count: number;
  has_profile: boolean;
  portfolio_slug: string | null;
}

export interface AdminApplication {
  id: string;
  user_id: string;
  user_email: string;
  company_name: string;
  role_title: string;
  status: string;
  location: string | null;
  applied_on: string | null;
  created_at: string;
}

export interface AdminProfile {
  id: string;
  user_id: string;
  user_email: string;
  name: string | null;
  job_title: string | null;
  portfolio_slug: string;
  is_public: boolean;
  updated_at: string;
}

export interface AdminAnalysis {
  id: string;
  user_id: string;
  user_email: string;
  analysis_type: string;
  score: number | null;
  application_id: string | null;
  created_at: string;
}

export type AdminUsersPage = Page<AdminUser>;
export type AdminApplicationsPage = Page<AdminApplication>;
export type AdminProfilesPage = Page<AdminProfile>;
export type AdminAnalysesPage = Page<AdminAnalysis>;

import type { APPLICATION_STATUSES } from "@/lib/constants/config";

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export interface JobApplication {
  id: string;
  user_id: string;
  company_name: string;
  role_title: string;
  job_url: string | null;
  source: string | null;
  location: string | null;
  employment_type: string | null;
  work_arrangement: string | null;
  salary_note: string | null;
  stack_tags: string[];
  status: ApplicationStatus;
  applied_on: string | null;
  notes: string | null;
  next_follow_up_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ApplicationCreatePayload {
  company_name: string;
  role_title: string;
  job_url?: string | null;
  source?: string | null;
  location?: string | null;
  employment_type?: string | null;
  work_arrangement?: string | null;
  salary_note?: string | null;
  stack_tags?: string[];
  status?: ApplicationStatus;
  applied_on?: string | null;
  notes?: string | null;
  next_follow_up_at?: string | null;
}

export type ApplicationUpdatePayload = Partial<ApplicationCreatePayload>;

export interface Profile {
  id: string;
  user_id: string;
  email: string | null;
  name: string | null;
  bio: string | null;
  job_title: string | null;
  location: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  skills: string[];
  resume_url: string | null;
  avatar_url: string | null;
  portfolio_slug: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface PublicProfile {
  name: string | null;
  bio: string | null;
  job_title: string | null;
  location: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  website_url: string | null;
  skills: string[];
  resume_url: string | null;
  avatar_url: string | null;
  portfolio_slug: string;
}

export interface ProfileUpdatePayload {
  name?: string | null;
  bio?: string | null;
  job_title?: string | null;
  location?: string | null;
  github_url?: string | null;
  linkedin_url?: string | null;
  website_url?: string | null;
  skills?: string[];
  portfolio_slug?: string;
  is_public?: boolean;
}

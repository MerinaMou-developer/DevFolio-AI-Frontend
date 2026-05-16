import { apiRequest } from "@/lib/api/client";
import type {
  AdminAnalysesPage,
  AdminApplicationsPage,
  AdminProfilesPage,
  AdminStats,
  AdminUser,
  AdminUsersPage,
} from "@/types/admin.types";

function qs(params: Record<string, string | number | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      search.set(key, String(value));
    }
  }
  const s = search.toString();
  return s ? `?${s}` : "";
}

export function getAdminStats(token: string) {
  return apiRequest<AdminStats>("/admin/stats", { token });
}

export function listAdminUsers(
  token: string,
  params: { page?: number; page_size?: number; q?: string } = {},
) {
  return apiRequest<AdminUsersPage>(`/admin/users${qs(params)}`, { token });
}

export function updateAdminUser(
  token: string,
  userId: string,
  body: { role?: string; is_active?: boolean },
) {
  return apiRequest<AdminUser>(`/admin/users/${userId}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(body),
  });
}

export function listAdminApplications(
  token: string,
  params: { page?: number; page_size?: number; q?: string; status?: string } = {},
) {
  return apiRequest<AdminApplicationsPage>(`/admin/applications${qs(params)}`, { token });
}

export function listAdminProfiles(
  token: string,
  params: { page?: number; page_size?: number; q?: string } = {},
) {
  return apiRequest<AdminProfilesPage>(`/admin/profiles${qs(params)}`, { token });
}

export function listAdminAnalyses(
  token: string,
  params: {
    page?: number;
    page_size?: number;
    q?: string;
    analysis_type?: string;
  } = {},
) {
  return apiRequest<AdminAnalysesPage>(`/admin/analyses${qs(params)}`, { token });
}

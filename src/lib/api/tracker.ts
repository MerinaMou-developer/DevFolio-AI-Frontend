import { apiRequest } from "@/lib/api/client";
import type { Page } from "@/types/api.types";
import type {
  ApplicationCreatePayload,
  ApplicationUpdatePayload,
  JobApplication,
} from "@/types/tracker.types";

export interface ListApplicationsParams {
  page?: number;
  page_size?: number;
  status?: string;
  q?: string;
}

export async function listApplications(token: string, params: ListApplicationsParams = {}) {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.page_size) search.set("page_size", String(params.page_size));
  if (params.status) search.set("status", params.status);
  if (params.q) search.set("q", params.q);
  const qs = search.toString();
  return apiRequest<Page<JobApplication>>(
    `/tracker/applications${qs ? `?${qs}` : ""}`,
    { token },
  );
}

export async function createApplication(token: string, payload: ApplicationCreatePayload) {
  return apiRequest<JobApplication>("/tracker/applications", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function updateApplication(
  token: string,
  id: string,
  payload: ApplicationUpdatePayload,
) {
  return apiRequest<JobApplication>(`/tracker/applications/${id}`, {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export async function deleteApplication(token: string, id: string) {
  return apiRequest<void>(`/tracker/applications/${id}`, {
    method: "DELETE",
    token,
  });
}

import { apiRequest } from "@/lib/api/client";
import type { Page } from "@/types/api.types";
import type { Analysis } from "@/types/ai.types";

export async function analyzeResume(token: string, resumeText?: string) {
  return apiRequest<Analysis>("/ai/resume/analyze", {
    method: "POST",
    token,
    body: JSON.stringify({ resume_text: resumeText ?? null }),
  });
}

export async function matchJob(
  token: string,
  payload: { application_id?: string; job_description?: string },
) {
  return apiRequest<Analysis>("/ai/job/match", {
    method: "POST",
    token,
    body: JSON.stringify(payload),
  });
}

export async function listAnalyses(
  token: string,
  params: { page?: number; analysis_type?: string } = {},
) {
  const search = new URLSearchParams();
  if (params.page) search.set("page", String(params.page));
  if (params.analysis_type) search.set("analysis_type", params.analysis_type);
  const qs = search.toString();
  return apiRequest<Page<Analysis>>(`/ai/analyses${qs ? `?${qs}` : ""}`, { token });
}

export async function getAnalysis(token: string, id: string) {
  return apiRequest<Analysis>(`/ai/analyses/${id}`, { token });
}

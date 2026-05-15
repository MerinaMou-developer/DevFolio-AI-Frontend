import { apiRequest } from "@/lib/api/client";
import type { Profile, ProfileUpdatePayload, PublicProfile } from "@/types/profile.types";

export async function getMyProfile(token: string) {
  return apiRequest<Profile>("/profile/me", { token });
}

export async function updateMyProfile(token: string, payload: ProfileUpdatePayload) {
  return apiRequest<Profile>("/profile/me", {
    method: "PATCH",
    token,
    body: JSON.stringify(payload),
  });
}

export async function uploadAvatar(token: string, file: File) {
  const form = new FormData();
  form.append("file", file);
  return apiRequest<{ url: string }>("/profile/me/avatar", {
    method: "POST",
    token,
    body: form,
  });
}

export async function uploadResume(token: string, file: File) {
  const form = new FormData();
  form.append("file", file);
  return apiRequest<{ url: string }>("/profile/me/resume", {
    method: "POST",
    token,
    body: form,
  });
}

export async function deleteResume(token: string) {
  return apiRequest<Profile>("/profile/me/resume", {
    method: "DELETE",
    token,
  });
}

export async function getPublicProfile(slug: string) {
  return apiRequest<PublicProfile>(`/portfolio/${slug}`, { skipAuth: true });
}

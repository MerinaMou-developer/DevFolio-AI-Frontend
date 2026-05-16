import { apiRequest } from "@/lib/api/client";
import type { TokenResponse, User } from "@/types/api.types";

export async function login(email: string, password: string) {
  return apiRequest<TokenResponse>("/auth/login", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({ email, password }),
  });
}

export async function register(email: string, password: string) {
  return apiRequest<User>("/auth/register", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({ email, password }),
  });
}

export async function googleSignIn(idToken: string) {
  return apiRequest<TokenResponse>("/auth/google", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({ id_token: idToken }),
  });
}

export async function getMe(token: string) {
  return apiRequest<User>("/auth/me", { token });
}

export async function forgotPassword(email: string) {
  return apiRequest<{ message: string }>("/auth/forgot-password", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({ email }),
  });
}

export async function resetPassword(token: string, newPassword: string) {
  return apiRequest<{ message: string }>("/auth/reset-password", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({ token, new_password: newPassword }),
  });
}

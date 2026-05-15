import { API_BASE, API_URL } from "@/lib/constants/config";
import type { ApiErrorBody, TokenResponse } from "@/types/api.types";

export class ApiClientError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiClientError";
    this.status = status;
  }
}

function parseErrorDetail(body: ApiErrorBody): string {
  if (!body.detail) return "Request failed";
  if (typeof body.detail === "string") return body.detail;
  return body.detail.map((d) => d.msg || "Validation error").join(", ");
}

export type RequestOptions = RequestInit & {
  token?: string | null;
  skipAuth?: boolean;
};

export async function apiRequest<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { token, skipAuth, headers: initHeaders, ...rest } = options;
  const headers = new Headers(initHeaders);

  if (!headers.has("Content-Type") && !(rest.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token && !skipAuth) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = path.startsWith("http") ? path : `${API_URL}${path}`;
  const response = await fetch(url, { ...rest, headers });

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const data = text ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "detail" in data
        ? parseErrorDetail(data as ApiErrorBody)
        : response.statusText;
    throw new ApiClientError(message, response.status);
  }

  return data as T;
}

export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function refreshAccessToken(
  refreshToken: string,
): Promise<TokenResponse> {
  return apiRequest<TokenResponse>("/auth/refresh", {
    method: "POST",
    skipAuth: true,
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
}

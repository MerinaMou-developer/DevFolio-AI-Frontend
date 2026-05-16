export interface ApiErrorBody {
  detail?: string | { msg?: string; loc?: string[] }[];
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
  plan: string;
  is_active: boolean;
}

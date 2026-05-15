export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:8000";

export const API_V1_PREFIX =
  process.env.NEXT_PUBLIC_API_V1_PREFIX || "/api/v1";

export const API_URL = `${API_BASE}${API_V1_PREFIX}`;

export const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";

export const TOKEN_STORAGE_KEY = "devfolio_tokens";

export const APPLICATION_STATUSES = [
  "applied",
  "screening",
  "interview",
  "offer",
  "rejected",
  "withdrawn",
] as const;

export const STATUS_LABELS: Record<(typeof APPLICATION_STATUSES)[number], string> = {
  applied: "Applied",
  screening: "Screening",
  interview: "Interview",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

export const STATUS_COLORS: Record<(typeof APPLICATION_STATUSES)[number], string> = {
  applied: "bg-[var(--color-brand)]/20 text-[var(--color-brand-light)] border-[var(--color-brand)]/30",
  screening: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  interview: "bg-[var(--color-mint)]/20 text-[var(--color-mint-bright)] border-[var(--color-mint)]/30",
  offer: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  rejected: "bg-red-500/20 text-red-300 border-red-500/30",
  withdrawn: "bg-zinc-500/20 text-zinc-400 border-zinc-500/30",
};

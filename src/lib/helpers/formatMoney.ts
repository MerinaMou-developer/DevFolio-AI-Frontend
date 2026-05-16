/** Format Stripe-style amount (cents) for display. */
export function formatPlanPayment(
  amountCents: number | null | undefined,
  currency: string | null | undefined,
  interval: string | null | undefined,
): string {
  if (amountCents == null || !currency) return "—";
  const amount = amountCents / 100;
  const code = currency.toUpperCase();
  const formatted = new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: code,
    minimumFractionDigits: 2,
  }).format(amount);
  if (interval === "month") return `${formatted} / mo`;
  if (interval === "year") return `${formatted} / yr`;
  return formatted;
}

export function formatRevenueTotal(
  totalCents: number,
  currency: string | null | undefined,
): string {
  if (!currency || totalCents <= 0) return "—";
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(totalCents / 100);
}

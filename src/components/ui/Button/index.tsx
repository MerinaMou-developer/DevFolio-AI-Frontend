import { cn } from "@/lib/helpers/cn";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "ghost-dark" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
}

const variants: Record<Variant, string> = {
  primary:
    "bg-[var(--color-mint)] text-[var(--color-navy-950)] hover:bg-[var(--color-mint-bright)] shadow-lg shadow-[var(--color-mint)]/30 border border-[var(--color-mint-dark)]/20 font-semibold",
  secondary:
    "bg-[var(--color-brand)] text-white hover:bg-[var(--color-brand-light)] shadow-md shadow-[var(--color-brand)]/25 border border-[var(--color-brand-dark)]/30",
  outline:
    "bg-transparent text-[var(--color-navy-900)] hover:bg-[var(--color-cyan-50)] border-2 border-[var(--color-brand)]/40 hover:border-[var(--color-brand)]",
  ghost:
    "bg-transparent text-[var(--color-text-secondary)] hover:bg-[var(--color-cyan-100)]/60 border border-transparent hover:text-[var(--color-navy-900)]",
  "ghost-dark":
    "bg-transparent text-[var(--color-muted)] hover:bg-[var(--color-navy-800)] border border-transparent hover:text-white",
  danger:
    "bg-red-600/90 text-white hover:bg-red-500 border border-red-500/50",
};

const sizes: Record<Size, string> = {
  sm: "px-3.5 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-7 py-3.5 text-base rounded-xl",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-brand)] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current" />
      ) : null}
      {children}
    </button>
  );
}

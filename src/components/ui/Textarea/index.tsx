import { cn } from "@/lib/helpers/cn";
import type { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  tone?: "light" | "dark";
}

export function Textarea({ className, label, error, id, tone = "light", ...props }: TextareaProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-1.5">
      {label ? (
        <label
          htmlFor={inputId}
          className={cn(
            "block text-sm font-medium",
            tone === "dark" ? "text-[var(--color-muted)]" : "text-zinc-300",
          )}
        >
          {label}
        </label>
      ) : null}
      <textarea
        id={inputId}
        className={cn(
          "min-h-[100px] w-full resize-y rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-1 focus:ring-[var(--color-brand)]",
          tone === "dark"
            ? "border-[var(--color-navy-700)] bg-[var(--color-navy-950)] text-white placeholder:text-[var(--color-muted)] focus:border-[var(--color-brand)]"
            : "border-[var(--color-cyan-200)] bg-white text-[var(--color-navy-900)] placeholder:text-[var(--color-text-secondary)]/60 focus:border-[var(--color-brand)]",
          error && "border-red-500/60",
          className,
        )}
        {...props}
      />
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}

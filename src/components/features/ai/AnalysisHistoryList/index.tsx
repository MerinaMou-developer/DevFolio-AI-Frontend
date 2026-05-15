"use client";

import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/helpers/cn";
import { analysisTypeLabel } from "@/lib/helpers/analysis";
import type { Analysis } from "@/types/ai.types";

interface AnalysisHistoryListProps {
  analyses: Analysis[];
  selectedId: string | null;
  onSelect: (analysis: Analysis) => void;
}

export function AnalysisHistoryList({
  analyses,
  selectedId,
  onSelect,
}: AnalysisHistoryListProps) {
  if (analyses.length === 0) {
    return (
      <p className="text-sm text-zinc-500">No analyses yet. Run your first one above.</p>
    );
  }

  return (
    <ul className="divide-y divide-[var(--color-navy-800)]">
      {analyses.map((a) => {
        const selected = selectedId === a.id;
        return (
          <li key={a.id}>
            <button
              type="button"
              onClick={() => onSelect(a)}
              className={cn(
                "flex w-full items-center justify-between gap-3 py-3.5 text-left text-sm transition-colors",
                selected
                  ? "bg-[var(--color-brand)]/10 -mx-2 rounded-lg px-2"
                  : "hover:bg-[var(--color-navy-950)]/80",
              )}
            >
              <span className={cn("font-medium", selected ? "text-white" : "text-zinc-300")}>
                {analysisTypeLabel(a.analysis_type)}
              </span>
              <span className="flex items-center gap-2 text-zinc-500">
                {a.score != null ? (
                  <span
                    className={cn(
                      "font-semibold",
                      selected ? "text-[var(--color-mint)]" : "text-[var(--color-brand-light)]",
                    )}
                  >
                    {a.score}/100
                  </span>
                ) : (
                  <span>—</span>
                )}
                <span className="hidden sm:inline">
                  {new Date(a.created_at).toLocaleDateString()}
                </span>
                <ChevronRight
                  className={cn(
                    "h-4 w-4 shrink-0 transition-transform",
                    selected ? "text-[var(--color-mint)]" : "text-zinc-600",
                  )}
                />
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

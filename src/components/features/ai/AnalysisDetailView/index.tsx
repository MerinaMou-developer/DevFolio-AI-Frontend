"use client";

import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import {
  analysisTypeLabel,
  parseJobMatchResult,
  parseResumeResult,
} from "@/lib/helpers/analysis";
import type { Analysis } from "@/types/ai.types";

function ResultList({ title, items }: { title: string; items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="mt-4">
      <h4 className="mb-2 text-sm font-medium text-zinc-300">{title}</h4>
      <ul className="list-inside list-disc space-y-1 text-sm text-zinc-400">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export function AnalysisDetailView({ analysis }: { analysis: Analysis }) {
  const resumeResult = parseResumeResult(analysis);
  const matchResult = parseJobMatchResult(analysis);

  return (
    <Card className="border-[var(--color-brand)]/30">
      <CardHeader>
        <CardTitle className="flex flex-wrap items-center gap-2">
          {analysisTypeLabel(analysis.analysis_type)}
          {analysis.score != null ? (
            <span className="rounded-full bg-[var(--color-mint)]/15 px-3 py-0.5 text-sm font-semibold text-[var(--color-mint)]">
              {analysis.score}/100
            </span>
          ) : null}
        </CardTitle>
        <p className="text-xs text-zinc-500">
          {new Date(analysis.created_at).toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
        {analysis.feedback ? (
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">{analysis.feedback}</p>
        ) : null}
      </CardHeader>

      {resumeResult?.summary ? (
        <p className="mb-2 text-sm text-zinc-300">{resumeResult.summary}</p>
      ) : null}
      {matchResult?.summary ? (
        <p className="mb-2 text-sm text-zinc-300">{matchResult.summary}</p>
      ) : null}

      {resumeResult ? <ResultList title="Strengths" items={resumeResult.strengths} /> : null}
      {resumeResult ? (
        <ResultList title="Improvements" items={resumeResult.improvements} />
      ) : null}
      {resumeResult?.missing_sections?.length ? (
        <ResultList title="Missing sections" items={resumeResult.missing_sections} />
      ) : null}
      {matchResult ? <ResultList title="Strengths" items={matchResult.strengths} /> : null}
      {matchResult ? <ResultList title="Gaps" items={matchResult.gaps} /> : null}
      {matchResult?.recommended_actions?.length ? (
        <ResultList title="Recommended actions" items={matchResult.recommended_actions} />
      ) : null}
    </Card>
  );
}

import type { Analysis } from "@/types/ai.types";
import type { JobMatchResult, ResumeAnalyzeResult } from "@/types/ai.types";

export const ANALYSIS_TYPE_LABELS: Record<string, string> = {
  resume_analyze: "Resume analysis",
  job_match: "Job match",
  cover_letter: "Cover letter",
  interview_questions: "Interview questions",
};

export function analysisTypeLabel(type: string): string {
  return ANALYSIS_TYPE_LABELS[type] ?? type.replace(/_/g, " ");
}

export function parseResumeResult(analysis: Analysis): ResumeAnalyzeResult | null {
  if (analysis.analysis_type !== "resume_analyze") return null;
  return analysis.result as unknown as ResumeAnalyzeResult;
}

export function parseJobMatchResult(analysis: Analysis): JobMatchResult | null {
  if (analysis.analysis_type !== "job_match") return null;
  return analysis.result as unknown as JobMatchResult;
}

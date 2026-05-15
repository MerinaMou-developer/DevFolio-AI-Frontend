export interface Analysis {
  id: string;
  analysis_type: string;
  score: number | null;
  feedback: string;
  result: Record<string, unknown>;
  application_id: string | null;
  created_at: string;
}

export interface ResumeAnalyzeResult {
  score: number;
  summary: string;
  strengths: string[];
  improvements: string[];
  missing_sections?: string[];
}

export interface JobMatchResult {
  match_score: number;
  summary: string;
  strengths: string[];
  gaps: string[];
  recommended_actions?: string[];
}

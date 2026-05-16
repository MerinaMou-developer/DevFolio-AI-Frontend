"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Textarea } from "@/components/ui/Textarea";
import { PageHeader } from "@/components/ui/PageHeader";
import { AnalysisDetailView } from "@/components/features/ai/AnalysisDetailView";
import { AnalysisHistoryList } from "@/components/features/ai/AnalysisHistoryList";
import { useAuth } from "@/context/AuthContext";
import { analyzeResume, listAnalyses, matchJob } from "@/lib/api/ai";
import { listApplications } from "@/lib/api/tracker";
import { ApiClientError } from "@/lib/api/client";
import type { Analysis } from "@/types/ai.types";
import type { JobApplication } from "@/types/tracker.types";

export default function AiStudioPage() {
  const { getToken } = useAuth();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [jobDescription, setJobDescription] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [selected, setSelected] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      const token = await getToken();
      if (!token) return;
      const [a, apps] = await Promise.all([
        listAnalyses(token, { page: 1 }),
        listApplications(token, { page_size: 50 }),
      ]);
      setAnalyses(a.items);
      setApplications(apps.items);
      setSelected((prev) => prev ?? a.items[0] ?? null);
    }
    load();
  }, [getToken]);

  async function runResumeAnalyze() {
    const token = await getToken();
    if (!token) return;
    setLoading("resume");
    setError("");
    try {
      const result = await analyzeResume(token);
      setSelected(result);
      setAnalyses((prev) => [result, ...prev]);
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : "Analysis failed";
      setError(
        err instanceof ApiClientError && err.status === 429
          ? `${msg} Upgrade on the Billing page for a higher daily limit.`
          : msg,
      );
    } finally {
      setLoading(null);
    }
  }

  async function runJobMatch() {
    const token = await getToken();
    if (!token) return;
    setLoading("match");
    setError("");
    try {
      const result = await matchJob(token, {
        application_id: applicationId || undefined,
        job_description: jobDescription || undefined,
      });
      setSelected(result);
      setAnalyses((prev) => [result, ...prev]);
    } catch (err) {
      const msg = err instanceof ApiClientError ? err.message : "Match failed";
      setError(
        err instanceof ApiClientError && err.status === 429
          ? `${msg} Upgrade on the Billing page for a higher daily limit.`
          : msg,
      );
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="AI Studio"
        description="Get instant feedback on your resume and see how well you match each job."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resume analyzer</CardTitle>
            <p className="text-sm text-zinc-400">
              Scores your uploaded resume and suggests improvements. Upload a PDF in Profile
              first.
            </p>
          </CardHeader>
          <Button
            onClick={runResumeAnalyze}
            isLoading={loading === "resume"}
            className="w-full"
          >
            Analyze my resume
          </Button>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Job match</CardTitle>
            <p className="text-sm text-zinc-400">
              Compare your profile against a job description and get a match score.
            </p>
          </CardHeader>
          <div className="space-y-4">
            <select
              className="w-full rounded-lg border border-[var(--color-navy-700)] bg-[var(--color-navy-950)] px-3 py-2 text-sm text-zinc-200"
              value={applicationId}
              onChange={(e) => setApplicationId(e.target.value)}
            >
              <option value="">Link to application (optional)</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.company_name} — {app.role_title}
                </option>
              ))}
            </select>
            <Textarea
              tone="dark"
              label="Job description"
              placeholder="Paste the job description here…"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={5}
            />
            <Button
              onClick={runJobMatch}
              isLoading={loading === "match"}
              className="w-full"
              disabled={!jobDescription.trim() && !applicationId}
            >
              Run job match
            </Button>
          </div>
        </Card>
      </div>

      {error ? <p className="mt-4 text-sm text-red-400">{error}</p> : null}

      <div id="history" className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Analysis history</CardTitle>
            <p className="text-sm text-zinc-500">Click any row to view full results</p>
          </CardHeader>
          <AnalysisHistoryList
            analyses={analyses}
            selectedId={selected?.id ?? null}
            onSelect={setSelected}
          />
        </Card>

        <div>
          {selected ? (
            <AnalysisDetailView analysis={selected} />
          ) : (
            <Card className="flex min-h-[200px] items-center justify-center border-dashed">
              <p className="text-sm text-zinc-500">
                Select an analysis from the list to view details
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

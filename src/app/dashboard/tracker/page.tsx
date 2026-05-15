"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { ApplicationCard } from "@/components/features/tracker/ApplicationCard";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/ui/PageHeader";
import { useAuth } from "@/context/AuthContext";
import {
  createApplication,
  deleteApplication,
  listApplications,
  updateApplication,
} from "@/lib/api/tracker";
import { ApiClientError } from "@/lib/api/client";
import { APPLICATION_STATUSES, STATUS_LABELS } from "@/lib/constants/config";
import type { JobApplication } from "@/types/tracker.types";

export default function TrackerPage() {
  const { getToken } = useAuth();
  const [apps, setApps] = useState<JobApplication[]>([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newApp, setNewApp] = useState({ company_name: "", role_title: "", job_url: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    setLoading(true);
    try {
      const data = await listApplications(token, {
        page_size: 100,
        status: filter || undefined,
        q: search || undefined,
      });
      setApps(data.items);
    } finally {
      setLoading(false);
    }
  }, [getToken, filter, search]);

  useEffect(() => {
    load();
  }, [load]);

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    const token = await getToken();
    if (!token) return;
    setError("");
    try {
      await createApplication(token, {
        company_name: newApp.company_name,
        role_title: newApp.role_title,
        job_url: newApp.job_url || null,
        status: "applied",
      });
      setShowForm(false);
      setNewApp({ company_name: "", role_title: "", job_url: "" });
      await load();
    } catch (err) {
      setError(err instanceof ApiClientError ? err.message : "Failed to create");
    }
  }

  async function handleStatusChange(id: string, status: JobApplication["status"]) {
    const token = await getToken();
    if (!token) return;
    await updateApplication(token, id, { status });
    await load();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this application?")) return;
    const token = await getToken();
    if (!token) return;
    await deleteApplication(token, id);
    await load();
  }

  const grouped = APPLICATION_STATUSES.reduce(
    (acc, status) => {
      acc[status] = apps.filter((a) => a.status === status);
      return acc;
    },
    {} as Record<string, JobApplication[]>,
  );

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Job tracker"
        description="Visual pipeline from applied to offer — search, filter, and update in one place."
      >
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" />
          Add application
        </Button>
      </PageHeader>

      <div className="mb-6 flex flex-wrap gap-3">
        <Input
          tone="dark"
          placeholder="Search company or role…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
        <select
          className="rounded-lg border border-[var(--color-navy-700)] bg-[var(--color-navy-950)] px-3 py-2 text-sm text-zinc-200"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        <Button variant="secondary" size="sm" onClick={load}>
          Refresh
        </Button>
      </div>

      {showForm ? (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>New application</CardTitle>
          </CardHeader>
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
            <Input
              tone="dark"
              label="Company"
              required
              value={newApp.company_name}
              onChange={(e) => setNewApp((p) => ({ ...p, company_name: e.target.value }))}
            />
            <Input
              tone="dark"
              label="Role title"
              required
              value={newApp.role_title}
              onChange={(e) => setNewApp((p) => ({ ...p, role_title: e.target.value }))}
            />
            <Input
              tone="dark"
              label="Job URL"
              className="sm:col-span-2"
              value={newApp.job_url}
              onChange={(e) => setNewApp((p) => ({ ...p, job_url: e.target.value }))}
            />
            {error ? <p className="text-sm text-red-400 sm:col-span-2">{error}</p> : null}
            <Button type="submit" className="sm:col-span-2">
              Save application
            </Button>
          </form>
        </Card>
      ) : null}

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-brand)]/30 border-t-[var(--color-brand)]" />
        </div>
      ) : filter ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {apps.map((app) => (
            <ApplicationCard
              key={app.id}
              app={app}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {APPLICATION_STATUSES.map((status) => (
            <div key={status} className="min-w-[280px] flex-1 rounded-2xl border border-[var(--color-navy-800)] bg-[var(--color-navy-950)]/40 p-3">
              <h3 className="mb-3 text-sm font-semibold text-[var(--color-muted)]">
                {STATUS_LABELS[status]} ({grouped[status]?.length ?? 0})
              </h3>
              <div className="space-y-3">
                {(grouped[status] ?? []).map((app) => (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

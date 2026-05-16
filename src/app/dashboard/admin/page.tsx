"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  Briefcase,
  Shield,
  Sparkles,
  UserCircle,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Pagination } from "@/components/ui/Pagination";
import { useAuth } from "@/context/AuthContext";
import { ApiClientError } from "@/lib/api/client";
import {
  getAdminStats,
  listAdminAnalyses,
  listAdminApplications,
  listAdminProfiles,
  listAdminUsers,
  updateAdminUser,
} from "@/lib/api/admin";
import { getStatusLabel, STATUS_LABELS } from "@/lib/constants/config";
import { formatDate, formatDateTime } from "@/lib/helpers/formatDate";
import type {
  AdminAnalysis,
  AdminApplication,
  AdminProfile,
  AdminStats,
  AdminUser,
} from "@/types/admin.types";

type Tab = "overview" | "users" | "applications" | "profiles" | "analyses";

const PAGE_SIZE = 15;

const tabs: { id: Tab; label: string; icon: typeof Users }[] = [
  { id: "overview", label: "Overview", icon: Shield },
  { id: "users", label: "Users", icon: Users },
  { id: "applications", label: "Applications", icon: Briefcase },
  { id: "profiles", label: "Portfolios", icon: UserCircle },
  { id: "analyses", label: "AI analyses", icon: Sparkles },
];

export default function AdminDashboardPage() {
  const { getToken } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");
  const [page, setPage] = useState(1);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [profiles, setProfiles] = useState<AdminProfile[]>([]);
  const [analyses, setAnalyses] = useState<AdminAnalysis[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [appliedQuery, setAppliedQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [appliedStatus, setAppliedStatus] = useState("");
  const [total, setTotal] = useState(0);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);
  const [actionError, setActionError] = useState("");

  const loadOverview = useCallback(async () => {
    const token = await getToken();
    if (!token) return;
    setOverviewLoading(true);
    setActionError("");
    try {
      setStats(await getAdminStats(token));
    } catch (err) {
      setActionError(err instanceof ApiClientError ? err.message : "Failed to load stats");
    } finally {
      setOverviewLoading(false);
    }
  }, [getToken]);

  const loadTable = useCallback(
    async (targetPage: number) => {
      const token = await getToken();
      if (!token || tab === "overview") return;
      setTableLoading(true);
      setActionError("");
      try {
        const params = {
          page: targetPage,
          page_size: PAGE_SIZE,
          q: appliedQuery || undefined,
        };
        if (tab === "users") {
          const data = await listAdminUsers(token, params);
          setUsers(data.items);
          setTotal(data.total);
        } else if (tab === "applications") {
          const data = await listAdminApplications(token, {
            ...params,
            status: appliedStatus || undefined,
          });
          setApplications(data.items);
          setTotal(data.total);
        } else if (tab === "profiles") {
          const data = await listAdminProfiles(token, params);
          setProfiles(data.items);
          setTotal(data.total);
        } else if (tab === "analyses") {
          const data = await listAdminAnalyses(token, params);
          setAnalyses(data.items);
          setTotal(data.total);
        }
      } catch (err) {
        setActionError(err instanceof ApiClientError ? err.message : "Failed to load data");
      } finally {
        setTableLoading(false);
      }
    },
    [getToken, tab, appliedQuery, appliedStatus],
  );

  useEffect(() => {
    if (tab === "overview") {
      loadOverview();
    } else {
      loadTable(page);
    }
  }, [tab, page, appliedQuery, appliedStatus, loadOverview, loadTable]);

  function applyFilters() {
    setPage(1);
    setAppliedQuery(searchInput.trim());
    setAppliedStatus(statusFilter);
  }

  function switchTab(next: Tab) {
    setTab(next);
    setPage(1);
    setSearchInput("");
    setAppliedQuery("");
    setStatusFilter("");
    setAppliedStatus("");
    setActionError("");
  }

  async function toggleBlock(user: AdminUser) {
    const token = await getToken();
    if (!token) return;
    setActionError("");
    try {
      await updateAdminUser(token, user.id, { is_active: !user.is_active });
      await loadTable(page);
    } catch (err) {
      setActionError(err instanceof ApiClientError ? err.message : "Update failed");
    }
  }

  return (
    <div className="mx-auto max-w-7xl">
      <PageHeader
        title="Admin console"
        description="Manage users, view all applications, portfolios, and AI activity across the platform."
      />

      <div className="mb-6 flex flex-wrap gap-2 border-b border-[var(--color-navy-800)] pb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => switchTab(t.id)}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.id
                ? "bg-[var(--color-brand)]/25 text-white"
                : "text-[var(--color-muted)] hover:bg-[var(--color-navy-800)] hover:text-white"
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
          </button>
        ))}
      </div>

      {tab !== "overview" ? (
        <div className="mb-4 flex flex-wrap items-end gap-3">
          <div className="min-w-[200px] flex-1">
            <Input
              placeholder="Search email, company, slug…"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") applyFilters();
              }}
            />
          </div>
          {tab === "applications" ? (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-[var(--color-navy-800)] bg-[var(--color-navy-950)] px-3 py-2 text-sm text-white"
            >
              <option value="">All statuses</option>
              {Object.entries(STATUS_LABELS).map(([k, label]) => (
                <option key={k} value={k}>
                  {label}
                </option>
              ))}
            </select>
          ) : null}
          <Button variant="secondary" size="sm" onClick={applyFilters}>
            Search
          </Button>
        </div>
      ) : null}

      {actionError ? <p className="mb-4 text-sm text-red-400">{actionError}</p> : null}

      {tab === "overview" && overviewLoading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[var(--color-brand)]/30 border-t-[var(--color-brand)]" />
        </div>
      ) : null}

      {tab === "overview" && !overviewLoading && stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Users" value={stats.total_users} hint={`${stats.active_users} active`} icon={Users} />
          <StatCard label="Admins" value={stats.admin_users} icon={Shield} />
          <StatCard
            label="Applications"
            value={stats.total_applications}
            hint="All users"
            icon={Briefcase}
          />
          <StatCard
            label="Portfolios"
            value={stats.total_profiles}
            hint={`${stats.public_profiles} public`}
            icon={UserCircle}
          />
          <StatCard label="AI analyses" value={stats.total_ai_analyses} icon={Sparkles} />
        </div>
      ) : null}

      {tab === "users" ? (
        <DataTable
          headers={["Email", "Role", "Status", "Joined", "Actions"]}
          empty="No users found."
          loading={tableLoading}
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onPageChange={setPage}
          rows={users.map((u) => [
            u.email,
            u.role,
            u.is_active ? (
              <span className="text-emerald-400">Active</span>
            ) : (
              <span className="text-red-400">Blocked</span>
            ),
            formatDate(u.created_at),
            <Button
              key={u.id}
              variant={u.is_active ? "danger" : "secondary"}
              size="sm"
              onClick={() => toggleBlock(u)}
              disabled={tableLoading}
            >
              {u.is_active ? "Block" : "Unblock"}
            </Button>,
          ])}
        />
      ) : null}

      {tab === "applications" ? (
        <DataTable
          headers={["Company", "Role", "User", "Status", "Applied"]}
          empty="No applications found."
          loading={tableLoading}
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onPageChange={setPage}
          rows={applications.map((a) => [
            a.company_name,
            a.role_title,
            a.user_email,
            getStatusLabel(a.status),
            a.applied_on ?? "—",
          ])}
        />
      ) : null}

      {tab === "profiles" ? (
        <DataTable
          headers={["User", "Name", "Slug", "Public", "Updated"]}
          empty="No profiles found."
          loading={tableLoading}
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onPageChange={setPage}
          rows={profiles.map((p) => [
            p.user_email,
            p.name ?? "—",
            p.is_public ? (
              <Link
                href={`/portfolio/${p.portfolio_slug}`}
                target="_blank"
                className="text-[var(--color-mint)] hover:underline"
              >
                {p.portfolio_slug}
              </Link>
            ) : (
              <span className="text-[var(--color-muted)]">{p.portfolio_slug}</span>
            ),
            p.is_public ? "Yes" : "No",
            formatDate(p.updated_at),
          ])}
        />
      ) : null}

      {tab === "analyses" ? (
        <DataTable
          headers={["User", "Type", "Score", "Created"]}
          empty="No analyses found."
          loading={tableLoading}
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
          onPageChange={setPage}
          rows={analyses.map((a) => [
            a.user_email,
            a.analysis_type.replace(/_/g, " "),
            a.score ?? "—",
            formatDateTime(a.created_at),
          ])}
        />
      ) : null}
    </div>
  );
}

function DataTable({
  headers,
  rows,
  empty,
  loading,
  page,
  pageSize,
  total,
  onPageChange,
}: {
  headers: string[];
  rows: (string | ReactNode)[][];
  empty: string;
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--color-navy-800)] bg-[var(--color-card)]">
      {loading ? (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-[var(--color-card)]/70 backdrop-blur-[1px]">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-brand)]/30 border-t-[var(--color-brand)]" />
        </div>
      ) : null}
      {rows.length === 0 && !loading ? (
        <p className="p-8 text-center text-sm text-[var(--color-muted)]">{empty}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-navy-800)] bg-[var(--color-navy-950)]/80">
                {headers.map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[var(--color-muted)]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-navy-800)]">
              {rows.map((row, i) => (
                <tr key={i} className="hover:bg-[var(--color-navy-800)]/40">
                  {row.map((cell, j) => (
                    <td key={j} className="px-4 py-3 text-white">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination
        page={page}
        pageSize={pageSize}
        total={total}
        onPageChange={onPageChange}
        disabled={loading}
      />
    </div>
  );
}

"use client";

import { ExternalLink, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { STATUS_COLORS, STATUS_LABELS } from "@/lib/constants/config";
import type { JobApplication } from "@/types/tracker.types";

interface ApplicationCardProps {
  app: JobApplication;
  onStatusChange: (id: string, status: JobApplication["status"]) => void;
  onDelete: (id: string) => void;
}

export function ApplicationCard({ app, onStatusChange, onDelete }: ApplicationCardProps) {
  return (
    <Card className="border-[var(--color-navy-800)] bg-[var(--color-navy-950)]/60 p-4 transition-colors hover:border-[var(--color-brand)]/30">
      <div className="mb-2 flex items-start justify-between gap-2">
        <div>
          <h4 className="font-medium text-zinc-100">{app.role_title}</h4>
          <p className="text-sm text-zinc-400">{app.company_name}</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 text-zinc-500 hover:text-red-400"
          onClick={() => onDelete(app.id)}
          aria-label="Delete"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
      <Badge className={STATUS_COLORS[app.status]}>{STATUS_LABELS[app.status]}</Badge>
      {app.stack_tags.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1">
          {app.stack_tags.map((tag) => (
            <span
              key={tag}
              className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-400"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      {app.job_url ? (
        <a
          href={app.job_url}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs text-violet-400 hover:underline"
        >
          Job posting <ExternalLink className="h-3 w-3" />
        </a>
      ) : null}
      <select
        className="mt-3 w-full rounded-lg border border-[var(--color-navy-700)] bg-[var(--color-navy-900)] px-2 py-1.5 text-xs text-zinc-200"
        value={app.status}
        onChange={(e) =>
          onStatusChange(app.id, e.target.value as JobApplication["status"])
        }
      >
        {Object.entries(STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </Card>
  );
}

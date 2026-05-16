import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize) || 1);
  const safePage = Math.min(page, totalPages);
  const start = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const end = Math.min(safePage * pageSize, total);

  return (
    <div className="flex flex-col gap-3 border-t border-[var(--color-navy-800)] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-[var(--color-muted)]">
        {total === 0
          ? "No results"
          : `Showing ${start}–${end} of ${total} · Page ${safePage} of ${totalPages}`}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost-dark"
          size="sm"
          disabled={disabled || safePage <= 1}
          onClick={() => onPageChange(safePage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        <Button
          variant="ghost-dark"
          size="sm"
          disabled={disabled || safePage >= totalPages}
          onClick={() => onPageChange(safePage + 1)}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

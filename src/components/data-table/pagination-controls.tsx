"use client";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { PaginationMeta } from "@/interfaces/paginatedResponse";

interface PaginationControlsProps {
  meta?: PaginationMeta;
  page: number;
  isFetching?: boolean;
  itemLabel?: string;
  onPageChange: (page: number) => void;
}

export function PaginationControls({
  meta,
  page,
  isFetching = false,
  itemLabel,
  onPageChange,
}: PaginationControlsProps) {
  const t = useTranslations("pagination");
  const common = useTranslations("common");
  const currentPage = meta?.current_page ?? page;
  const lastPage = meta?.last_page ?? 1;
  const resolvedItemLabel = itemLabel ?? t("items");

  return (
    <div className="flex items-center justify-between">
      <p className="text-muted-foreground text-sm">
        {t("pageInfo", { current: currentPage, last: lastPage })}
        {meta ? ` · ${meta.total} ${resolvedItemLabel}` : ""}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1 || isFetching}
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        >
          {common("previous")}
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= lastPage || isFetching}
          onClick={() => onPageChange(currentPage + 1)}
        >
          {common("next")}
        </Button>
      </div>
    </div>
  );
}

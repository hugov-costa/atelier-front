"use client";

import { useState } from "react";

import { DataTableSort } from "@/components/data-table/data-table";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

interface UseListControllerOptions {
  perPage: number;
  initialSort?: DataTableSort;
}

export function useListController({
  perPage,
  initialSort,
}: UseListControllerOptions) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<DataTableSort | null>(initialSort ?? null);
  const debouncedSearch = useDebouncedValue(search);

  const onSearchChange = (value: string) => {
    setPage(1);
    setSearch(value);
  };

  const onSortChange = (sortKey: string) => {
    setPage(1);
    setSort((current) =>
      current && current.key === sortKey
        ? {
            key: sortKey,
            direction: current.direction === "asc" ? "desc" : "asc",
          }
        : { key: sortKey, direction: "asc" },
    );
  };

  return {
    page,
    perPage,
    setPage,
    search,
    debouncedSearch,
    onSearchChange,
    sort,
    onSortChange,
  };
}

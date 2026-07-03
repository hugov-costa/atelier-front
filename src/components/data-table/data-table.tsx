"use client";

import { ChevronDown, ChevronsUpDown, ChevronUp } from "lucide-react";
import { ReactNode } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type SortDirection = "asc" | "desc";

export interface DataTableSort {
  key: string;
  direction: SortDirection;
}

export interface DataTableColumn<TData> {
  id: string;
  header: ReactNode;
  cell: (item: TData) => ReactNode;
  headerClassName?: string;
  cellClassName?: string;
  sortable?: boolean;
  sortKey?: string;
}

interface DataTableProps<TData> {
  columns: DataTableColumn<TData>[];
  data: TData[];
  getRowKey: (item: TData) => string | number;
  isLoading?: boolean;
  emptyMessage: string;
  skeletonRowCount?: number;
  sort?: DataTableSort | null;
  onSortChange?: (sortKey: string) => void;
}

function SortIndicator({ direction }: { direction: SortDirection | null }) {
  if (direction === "asc") {
    return <ChevronUp className="size-4" aria-hidden="true" />;
  }

  if (direction === "desc") {
    return <ChevronDown className="size-4" aria-hidden="true" />;
  }

  return (
    <ChevronsUpDown
      className="text-muted-foreground size-4"
      aria-hidden="true"
    />
  );
}

export function DataTable<TData>({
  columns,
  data,
  getRowKey,
  isLoading = false,
  emptyMessage,
  skeletonRowCount = 5,
  sort = null,
  onSortChange,
}: DataTableProps<TData>) {
  return (
    <div className="border-border overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => {
              const sortKey = column.sortKey ?? column.id;
              const isSortable =
                Boolean(column.sortable) && Boolean(onSortChange);
              const activeDirection =
                sort && sort.key === sortKey ? sort.direction : null;

              return (
                <TableHead
                  key={column.id}
                  className={column.headerClassName}
                  aria-sort={
                    activeDirection === "asc"
                      ? "ascending"
                      : activeDirection === "desc"
                        ? "descending"
                        : undefined
                  }
                >
                  {isSortable ? (
                    <button
                      type="button"
                      onClick={() => onSortChange?.(sortKey)}
                      className="text-foreground hover:text-foreground/80 focus-visible:ring-ring -mx-2 inline-flex items-center gap-1 rounded px-2 py-1 focus-visible:ring-2 focus-visible:outline-none"
                    >
                      {column.header}
                      <SortIndicator direction={activeDirection} />
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: skeletonRowCount }).map((_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`}>
                  {columns.map((column) => (
                    <TableCell key={`skeleton-${column.id}`}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : null}

          {!isLoading && data.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-muted-foreground h-24 text-center"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : null}

          {!isLoading
            ? data.map((item) => (
                <TableRow key={getRowKey(item)}>
                  {columns.map((column) => (
                    <TableCell key={column.id} className={column.cellClassName}>
                      {column.cell(item)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : null}
        </TableBody>
      </Table>
    </div>
  );
}

"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { MonthlyReportParams } from "@/interfaces/monthlyReport";
import { queryKeys } from "@/lib/queryKeys";
import { getMonthlyReport } from "@/services/reportService";

interface UseMonthlyReportOptions {
  enabled?: boolean;
}

export function useMonthlyReport(
  params: MonthlyReportParams,
  options: UseMonthlyReportOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.monthlyReport(params),
    queryFn: () => getMonthlyReport(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}

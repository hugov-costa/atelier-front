"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import { getStudentStatement } from "@/services/studentStatementService";

export function useStudentStatement(
  studentId: string,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: queryKeys.studentStatement(studentId),
    queryFn: () => getStudentStatement(studentId),
    enabled: options?.enabled ?? true,
  });
}

"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { ListUsersParams } from "@/interfaces/userResponse";
import { queryKeys } from "@/lib/queryKeys";
import { listUsers } from "@/services/userService";

interface UseUsersOptions {
  enabled?: boolean;
}

export function useUsers(
  params: ListUsersParams,
  options: UseUsersOptions = {},
) {
  return useQuery({
    queryKey: queryKeys.usersList(params),
    queryFn: () => listUsers(params),
    placeholderData: keepPreviousData,
    enabled: options.enabled ?? true,
  });
}

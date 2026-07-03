"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/queryKeys";
import { getUser } from "@/services/userService";

export function useGetUser(userId: string) {
  return useQuery({
    queryKey: queryKeys.user(userId),
    queryFn: () => getUser(userId),
    enabled: userId.length > 0,
  });
}

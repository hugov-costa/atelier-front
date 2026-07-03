"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { useUser } from "@/contexts/user-context";
import { queryKeys } from "@/lib/queryKeys";
import { getCurrentUser } from "@/services/authService";

export function useCurrentUser() {
  const { setUser } = useUser();

  const query = useQuery({
    queryKey: queryKeys.currentUser,
    queryFn: getCurrentUser,
    retry: false,
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  return query;
}

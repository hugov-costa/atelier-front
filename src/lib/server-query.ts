import { QueryClient } from "@tanstack/react-query";

const PREFETCH_STALE_TIME_IN_MILLISECONDS = 30 * 1000;

export function makeServerQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: PREFETCH_STALE_TIME_IN_MILLISECONDS,
      },
    },
  });
}

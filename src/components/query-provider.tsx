"use client";

import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactNode, useState } from "react";

import { captureError } from "@/lib/error-reporter";
import { redirectToLoginOnExpiredSession } from "@/lib/session-redirect";
import { HttpError } from "@/utils/httpError";
import { HttpStatusType } from "@/types/httpStatus";

const DEFAULT_STALE_TIME_IN_MILLISECONDS = 30 * 1000;
const MAXIMUM_RETRY_ATTEMPTS = 2;

function isUnauthorized(error: unknown): boolean {
  return (
    error instanceof HttpError && error.status === HttpStatusType.UNAUTHORIZED
  );
}

function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (
    error instanceof HttpError &&
    error.status < HttpStatusType.INTERNAL_SERVER_ERROR
  ) {
    return false;
  }

  return failureCount < MAXIMUM_RETRY_ATTEMPTS;
}

function handleGlobalError(error: unknown): void {
  if (isUnauthorized(error)) {
    redirectToLoginOnExpiredSession();
    return;
  }

  captureError(error, {
    source: "tanstack-query",
    requestId: error instanceof HttpError ? error.requestId : null,
  });
}

function createQueryClient(): QueryClient {
  return new QueryClient({
    queryCache: new QueryCache({ onError: handleGlobalError }),
    mutationCache: new MutationCache({ onError: handleGlobalError }),
    defaultOptions: {
      queries: {
        staleTime: DEFAULT_STALE_TIME_IN_MILLISECONDS,
        retry: shouldRetryQuery,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

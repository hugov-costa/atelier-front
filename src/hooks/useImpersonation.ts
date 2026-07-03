"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import {
  startImpersonation,
  stopImpersonation,
} from "@/services/impersonationService";
import { HttpError } from "@/utils/httpError";

interface StartImpersonationInput {
  userId: string;
  reason: string;
}

export function useImpersonation() {
  const t = useTranslations("impersonation");
  const queryClient = useQueryClient();

  function reloadAs(path: string) {
    queryClient.clear();
    window.location.assign(path);
  }

  const startMutation = useMutation({
    mutationFn: ({ userId, reason }: StartImpersonationInput) =>
      startImpersonation(userId, reason),
    onSuccess: () => reloadAs("/"),
    onError: (error) => {
      const message =
        error instanceof HttpError ? error.message : t("startError");
      toast.error(message);
    },
  });

  const stopMutation = useMutation({
    mutationFn: stopImpersonation,
    onSuccess: () => reloadAs("/"),
    onError: (error) => {
      const message =
        error instanceof HttpError ? error.message : t("stopError");
      toast.error(message);
    },
  });

  return { startMutation, stopMutation };
}

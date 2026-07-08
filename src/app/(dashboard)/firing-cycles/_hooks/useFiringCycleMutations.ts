"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { FiringCycleFormValues } from "@/app/(dashboard)/firing-cycles/_schemas/firingCycleSchema";
import {
  CreateFiringCyclePayload,
  UpdateFiringCyclePayload,
} from "@/interfaces/firingCycle";
import { queryKeys } from "@/lib/queryKeys";
import {
  createFiringCycle,
  deleteFiringCycle,
  updateFiringCycle,
} from "@/services/firingCycleService";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

interface UseFiringCycleFormMutationOptions {
  onSuccess?: () => void;
  setError: UseFormSetError<FiringCycleFormValues>;
}

export function useCreateFiringCycle({
  onSuccess,
  setError,
}: UseFiringCycleFormMutationOptions) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFiringCyclePayload) =>
      createFiringCycle(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.firingCyclesLists });
      toast.success(t("created"));
      onSuccess?.();
    },
    onError: (error) => {
      if (!handleFormValidationError(error, setError)) {
        toast.error(resolveHttpErrorMessage(error, t, "createError"));
      }
    },
  });
}

export function useDeleteFiringCycle() {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (firingCycleId: string) => deleteFiringCycle(firingCycleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.firingCyclesLists });
      toast.success(t("deleted"));
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "deleteError"));
    },
  });
}

export function useUpdateFiringCycle({
  firingCycleId,
  onSuccess,
  setError,
}: UseFiringCycleFormMutationOptions & { firingCycleId: string }) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateFiringCyclePayload) =>
      updateFiringCycle(firingCycleId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.firingCyclesLists });
      queryClient.invalidateQueries({
        queryKey: queryKeys.firingCycle(firingCycleId),
      });
      toast.success(t("updated"));
      onSuccess?.();
    },
    onError: (error) => {
      if (!handleFormValidationError(error, setError)) {
        toast.error(resolveHttpErrorMessage(error, t, "updateError"));
      }
    },
  });
}

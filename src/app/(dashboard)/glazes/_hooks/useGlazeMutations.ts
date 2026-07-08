"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { GlazeFormValues } from "@/app/(dashboard)/glazes/_schemas/glazeSchema";
import { CreateGlazePayload, UpdateGlazePayload } from "@/interfaces/glaze";
import { queryKeys } from "@/lib/queryKeys";
import { createGlaze, deleteGlaze, updateGlaze } from "@/services/glazeService";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

interface UseGlazeFormMutationOptions {
  onSuccess?: () => void;
  setError: UseFormSetError<GlazeFormValues>;
}

export function useCreateGlaze({
  onSuccess,
  setError,
}: UseGlazeFormMutationOptions) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGlazePayload) => createGlaze(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.glazesLists });
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

export function useDeleteGlaze() {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (glazeId: string) => deleteGlaze(glazeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.glazesLists });
      toast.success(t("deleted"));
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "deleteError"));
    },
  });
}

export function useUpdateGlaze({
  glazeId,
  onSuccess,
  setError,
}: UseGlazeFormMutationOptions & { glazeId: string }) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateGlazePayload) => updateGlaze(glazeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.glazesLists });
      queryClient.invalidateQueries({ queryKey: queryKeys.glaze(glazeId) });
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

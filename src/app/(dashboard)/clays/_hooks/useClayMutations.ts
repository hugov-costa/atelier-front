"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { ClayFormValues } from "@/app/(dashboard)/clays/_schemas/claySchema";
import { CreateClayPayload, UpdateClayPayload } from "@/interfaces/clay";
import { queryKeys } from "@/lib/queryKeys";
import { createClay, deleteClay, updateClay } from "@/services/clayService";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

interface UseClayFormMutationOptions {
  onSuccess?: () => void;
  setError: UseFormSetError<ClayFormValues>;
}

export function useCreateClay({
  onSuccess,
  setError,
}: UseClayFormMutationOptions) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClayPayload) => createClay(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.claysLists });
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

export function useDeleteClay() {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (clayId: string) => deleteClay(clayId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.claysLists });
      toast.success(t("deleted"));
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "deleteError"));
    },
  });
}

export function useUpdateClay({
  clayId,
  onSuccess,
  setError,
}: UseClayFormMutationOptions & { clayId: string }) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateClayPayload) => updateClay(clayId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.claysLists });
      queryClient.invalidateQueries({ queryKey: queryKeys.clay(clayId) });
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

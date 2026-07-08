"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { RecurrentClassFormValues } from "@/app/(dashboard)/recurrent-classes/_schemas/recurrentClassSchema";
import {
  CreateRecurrentClassPayload,
  UpdateRecurrentClassPayload,
} from "@/interfaces/recurrentClass";
import { queryKeys } from "@/lib/queryKeys";
import {
  createRecurrentClass,
  deleteRecurrentClass,
  updateRecurrentClass,
} from "@/services/recurrentClassService";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

interface UseRecurrentClassFormMutationOptions {
  onSuccess?: () => void;
  setError: UseFormSetError<RecurrentClassFormValues>;
}

export function useCreateRecurrentClass({
  onSuccess,
  setError,
}: UseRecurrentClassFormMutationOptions) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateRecurrentClassPayload) =>
      createRecurrentClass(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.recurrentClassesLists,
      });
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

export function useDeleteRecurrentClass() {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (recurrentClassId: string) =>
      deleteRecurrentClass(recurrentClassId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.recurrentClassesLists,
      });
      toast.success(t("deleted"));
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "deleteError"));
    },
  });
}

export function useUpdateRecurrentClass({
  recurrentClassId,
  onSuccess,
  setError,
}: UseRecurrentClassFormMutationOptions & { recurrentClassId: string }) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateRecurrentClassPayload) =>
      updateRecurrentClass(recurrentClassId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.recurrentClassesLists,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.recurrentClass(recurrentClassId),
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

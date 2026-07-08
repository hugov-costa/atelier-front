"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { SingleClassFormValues } from "@/app/(dashboard)/single-classes/_schemas/singleClassSchema";
import {
  CreateSingleClassPayload,
  UpdateSingleClassPayload,
} from "@/interfaces/singleClass";
import { queryKeys } from "@/lib/queryKeys";
import {
  createSingleClass,
  deleteSingleClass,
  updateSingleClass,
} from "@/services/singleClassService";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

interface UseSingleClassFormMutationOptions {
  onSuccess?: () => void;
  setError: UseFormSetError<SingleClassFormValues>;
}

export function useCreateSingleClass({
  onSuccess,
  setError,
}: UseSingleClassFormMutationOptions) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSingleClassPayload) =>
      createSingleClass(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.singleClassesLists,
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

export function useDeleteSingleClass() {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (singleClassId: string) => deleteSingleClass(singleClassId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.singleClassesLists,
      });
      toast.success(t("deleted"));
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "deleteError"));
    },
  });
}

export function useUpdateSingleClass({
  singleClassId,
  onSuccess,
  setError,
}: UseSingleClassFormMutationOptions & { singleClassId: string }) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSingleClassPayload) =>
      updateSingleClass(singleClassId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.singleClassesLists,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.singleClass(singleClassId),
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

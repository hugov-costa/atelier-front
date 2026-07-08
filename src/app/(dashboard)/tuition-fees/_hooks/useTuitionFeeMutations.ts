"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { TuitionFeeFormValues } from "@/app/(dashboard)/tuition-fees/_schemas/tuitionFeeSchema";
import {
  CreateTuitionFeePayload,
  UpdateTuitionFeePayload,
} from "@/interfaces/tuitionFee";
import { queryKeys } from "@/lib/queryKeys";
import {
  createTuitionFee,
  deleteTuitionFee,
  updateTuitionFee,
} from "@/services/tuitionFeeService";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

interface UseCreateTuitionFeeOptions {
  onSuccess?: () => void;
  setError: UseFormSetError<TuitionFeeFormValues>;
}

export function useCreateTuitionFee({
  onSuccess,
  setError,
}: UseCreateTuitionFeeOptions) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTuitionFeePayload) => createTuitionFee(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tuitionFeesLists });
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

export function useDeleteTuitionFee() {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tuitionFeeId: string) => deleteTuitionFee(tuitionFeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tuitionFeesLists });
      toast.success(t("deleted"));
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "deleteError"));
    },
  });
}

export function useUpdateTuitionFee(tuitionFeeId: string) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTuitionFeePayload) =>
      updateTuitionFee(tuitionFeeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.tuitionFeesLists });
      queryClient.invalidateQueries({
        queryKey: queryKeys.tuitionFee(tuitionFeeId),
      });
      toast.success(t("updated"));
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "updateError"));
    },
  });
}

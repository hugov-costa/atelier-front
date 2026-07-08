"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { CommissionOrderFormValues } from "@/app/(dashboard)/commission-orders/_schemas/commissionOrderSchema";
import {
  CreateCommissionOrderPayload,
  UpdateCommissionOrderPayload,
} from "@/interfaces/commissionOrder";
import { queryKeys } from "@/lib/queryKeys";
import {
  createCommissionOrder,
  deleteCommissionOrder,
  updateCommissionOrder,
} from "@/services/commissionOrderService";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

interface UseCommissionOrderFormMutationOptions {
  onSuccess?: () => void;
  setError: UseFormSetError<CommissionOrderFormValues>;
}

export function useCreateCommissionOrder({
  onSuccess,
  setError,
}: UseCommissionOrderFormMutationOptions) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCommissionOrderPayload) =>
      createCommissionOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.commissionOrdersLists,
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

export function useDeleteCommissionOrder() {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (commissionOrderId: string) =>
      deleteCommissionOrder(commissionOrderId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.commissionOrdersLists,
      });
      toast.success(t("deleted"));
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "deleteError"));
    },
  });
}

export function useUpdateCommissionOrder({
  commissionOrderId,
  onSuccess,
  setError,
}: UseCommissionOrderFormMutationOptions & { commissionOrderId: string }) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCommissionOrderPayload) =>
      updateCommissionOrder(commissionOrderId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.commissionOrdersLists,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.commissionOrder(commissionOrderId),
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

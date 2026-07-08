"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { BillFormValues } from "@/app/(dashboard)/bills/_schemas/billSchema";
import { CreateBillPayload, UpdateBillPayload } from "@/interfaces/bill";
import { queryKeys } from "@/lib/queryKeys";
import { createBill, deleteBill, updateBill } from "@/services/billService";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

interface UseBillFormMutationOptions {
  onSuccess?: () => void;
  setError: UseFormSetError<BillFormValues>;
}

export function useCreateBill({
  onSuccess,
  setError,
}: UseBillFormMutationOptions) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateBillPayload) => createBill(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.billsLists });
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

export function useDeleteBill() {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (billId: string) => deleteBill(billId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.billsLists });
      toast.success(t("deleted"));
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "deleteError"));
    },
  });
}

export function useUpdateBill({
  billId,
  onSuccess,
  setError,
}: UseBillFormMutationOptions & { billId: string }) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateBillPayload) => updateBill(billId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.billsLists });
      queryClient.invalidateQueries({ queryKey: queryKeys.bill(billId) });
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

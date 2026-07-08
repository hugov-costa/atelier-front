"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { ClaySupplierFormValues } from "@/app/(dashboard)/clay-suppliers/_schemas/claySupplierSchema";
import {
  CreateClaySupplierPayload,
  UpdateClaySupplierPayload,
} from "@/interfaces/claySupplier";
import { queryKeys } from "@/lib/queryKeys";
import {
  createClaySupplier,
  deleteClaySupplier,
  updateClaySupplier,
} from "@/services/claySupplierService";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

interface UseClaySupplierFormMutationOptions {
  onSuccess?: () => void;
  setError: UseFormSetError<ClaySupplierFormValues>;
}

export function useCreateClaySupplier({
  onSuccess,
  setError,
}: UseClaySupplierFormMutationOptions) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClaySupplierPayload) =>
      createClaySupplier(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.claySuppliersLists });
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

export function useDeleteClaySupplier() {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (claySupplierId: string) => deleteClaySupplier(claySupplierId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.claySuppliersLists });
      toast.success(t("deleted"));
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "deleteError"));
    },
  });
}

export function useUpdateClaySupplier({
  claySupplierId,
  onSuccess,
  setError,
}: UseClaySupplierFormMutationOptions & { claySupplierId: string }) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateClaySupplierPayload) =>
      updateClaySupplier(claySupplierId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.claySuppliersLists });
      queryClient.invalidateQueries({
        queryKey: queryKeys.claySupplier(claySupplierId),
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

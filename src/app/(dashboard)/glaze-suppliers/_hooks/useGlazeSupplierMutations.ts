"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { GlazeSupplierFormValues } from "@/app/(dashboard)/glaze-suppliers/_schemas/glazeSupplierSchema";
import {
  CreateGlazeSupplierPayload,
  UpdateGlazeSupplierPayload,
} from "@/interfaces/glazeSupplier";
import { queryKeys } from "@/lib/queryKeys";
import {
  createGlazeSupplier,
  deleteGlazeSupplier,
  updateGlazeSupplier,
} from "@/services/glazeSupplierService";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

interface UseGlazeSupplierFormMutationOptions {
  onSuccess?: () => void;
  setError: UseFormSetError<GlazeSupplierFormValues>;
}

export function useCreateGlazeSupplier({
  onSuccess,
  setError,
}: UseGlazeSupplierFormMutationOptions) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGlazeSupplierPayload) =>
      createGlazeSupplier(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.glazeSuppliersLists,
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

export function useDeleteGlazeSupplier() {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (glazeSupplierId: string) =>
      deleteGlazeSupplier(glazeSupplierId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.glazeSuppliersLists,
      });
      toast.success(t("deleted"));
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "deleteError"));
    },
  });
}

export function useUpdateGlazeSupplier({
  glazeSupplierId,
  onSuccess,
  setError,
}: UseGlazeSupplierFormMutationOptions & { glazeSupplierId: string }) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateGlazeSupplierPayload) =>
      updateGlazeSupplier(glazeSupplierId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.glazeSuppliersLists,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.glazeSupplier(glazeSupplierId),
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

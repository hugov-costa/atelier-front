"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { MaterialPurchaseFormValues } from "@/app/(dashboard)/material-purchases/_schemas/materialPurchaseSchema";
import {
  CreateMaterialPurchasePayload,
  UpdateMaterialPurchasePayload,
} from "@/interfaces/materialPurchase";
import { queryKeys } from "@/lib/queryKeys";
import {
  createMaterialPurchase,
  deleteMaterialPurchase,
  updateMaterialPurchase,
} from "@/services/materialPurchaseService";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

interface UseMaterialPurchaseFormMutationOptions {
  onSuccess?: () => void;
  setError: UseFormSetError<MaterialPurchaseFormValues>;
}

export function useCreateMaterialPurchase({
  onSuccess,
  setError,
}: UseMaterialPurchaseFormMutationOptions) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMaterialPurchasePayload) =>
      createMaterialPurchase(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.materialPurchasesLists,
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

export function useDeleteMaterialPurchase() {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (materialPurchaseId: string) =>
      deleteMaterialPurchase(materialPurchaseId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.materialPurchasesLists,
      });
      toast.success(t("deleted"));
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "deleteError"));
    },
  });
}

export function useUpdateMaterialPurchase({
  materialPurchaseId,
  onSuccess,
  setError,
}: UseMaterialPurchaseFormMutationOptions & { materialPurchaseId: string }) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateMaterialPurchasePayload) =>
      updateMaterialPurchase(materialPurchaseId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.materialPurchasesLists,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.materialPurchase(materialPurchaseId),
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

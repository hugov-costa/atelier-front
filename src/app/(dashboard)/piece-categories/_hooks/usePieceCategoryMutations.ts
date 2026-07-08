"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { PieceCategoryFormValues } from "@/app/(dashboard)/piece-categories/_schemas/pieceCategorySchema";
import {
  CreatePieceCategoryPayload,
  UpdatePieceCategoryPayload,
} from "@/interfaces/pieceCategory";
import { queryKeys } from "@/lib/queryKeys";
import {
  createPieceCategory,
  deletePieceCategory,
  updatePieceCategory,
} from "@/services/pieceCategoryService";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

interface UsePieceCategoryFormMutationOptions {
  onSuccess?: () => void;
  setError: UseFormSetError<PieceCategoryFormValues>;
}

export function useCreatePieceCategory({
  onSuccess,
  setError,
}: UsePieceCategoryFormMutationOptions) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePieceCategoryPayload) =>
      createPieceCategory(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.pieceCategoriesLists,
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

export function useDeletePieceCategory() {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pieceCategoryId: string) =>
      deletePieceCategory(pieceCategoryId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.pieceCategoriesLists,
      });
      toast.success(t("deleted"));
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "deleteError"));
    },
  });
}

export function useUpdatePieceCategory({
  onSuccess,
  pieceCategoryId,
  setError,
}: UsePieceCategoryFormMutationOptions & { pieceCategoryId: string }) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePieceCategoryPayload) =>
      updatePieceCategory(pieceCategoryId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.pieceCategoriesLists,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.pieceCategory(pieceCategoryId),
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

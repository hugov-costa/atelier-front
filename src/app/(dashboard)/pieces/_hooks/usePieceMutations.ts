"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { PieceFormValues } from "@/app/(dashboard)/pieces/_schemas/pieceSchema";
import { CreatePiecePayload, UpdatePiecePayload } from "@/interfaces/piece";
import { queryKeys } from "@/lib/queryKeys";
import { createPiece, deletePiece, updatePiece } from "@/services/pieceService";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

interface UsePieceFormMutationOptions {
  onSuccess?: () => void;
  setError: UseFormSetError<PieceFormValues>;
}

export function useCreatePiece({
  onSuccess,
  setError,
}: UsePieceFormMutationOptions) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePiecePayload) => createPiece(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.piecesLists });
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

export function useDeletePiece() {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pieceId: string) => deletePiece(pieceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.piecesLists });
      toast.success(t("deleted"));
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "deleteError"));
    },
  });
}

export function useUpdatePiece({
  onSuccess,
  pieceId,
  setError,
}: UsePieceFormMutationOptions & { pieceId: string }) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePiecePayload) => updatePiece(pieceId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.piecesLists });
      queryClient.invalidateQueries({ queryKey: queryKeys.piece(pieceId) });
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

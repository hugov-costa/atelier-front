"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { UpdatePieceChargePayload } from "@/interfaces/pieceCharge";
import { queryKeys } from "@/lib/queryKeys";
import { updatePieceCharge } from "@/services/pieceChargeService";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

export function useUpdatePieceCharge(pieceChargeId: string) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePieceChargePayload) =>
      updatePieceCharge(pieceChargeId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pieceChargesLists });
      queryClient.invalidateQueries({
        queryKey: queryKeys.pieceCharge(pieceChargeId),
      });
      toast.success(t("updated"));
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "updateError"));
    },
  });
}

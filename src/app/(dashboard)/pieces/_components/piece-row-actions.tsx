"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { PieceFormDialog } from "@/app/(dashboard)/pieces/_components/piece-form-dialog";
import { useDeletePiece } from "@/app/(dashboard)/pieces/_hooks/usePieceMutations";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Piece } from "@/interfaces/piece";

export function PieceRowActions({ piece }: { piece: Piece }) {
  const t = useTranslations("pieces");
  const common = useTranslations("common");
  const deletePiece = useDeletePiece();

  return (
    <div className="flex items-center justify-end gap-2">
      <PieceFormDialog
        piece={piece}
        trigger={
          <Button variant="outline" size="sm">
            <Pencil className="size-4" />
            {common("edit")}
          </Button>
        }
      />

      <ConfirmDialog
        title={t("deleteTitle")}
        description={t("deleteDescription", { name: piece.name })}
        confirmLabel={common("delete")}
        cancelLabel={common("cancel")}
        isConfirming={deletePiece.isPending}
        onConfirm={() => deletePiece.mutate(piece.id)}
        trigger={
          <Button variant="outline" size="sm">
            <Trash2 className="size-4" />
            {common("delete")}
          </Button>
        }
      />
    </div>
  );
}

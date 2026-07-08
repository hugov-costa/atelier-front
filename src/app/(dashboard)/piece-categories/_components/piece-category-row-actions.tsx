"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { PieceCategoryFormDialog } from "@/app/(dashboard)/piece-categories/_components/piece-category-form-dialog";
import { useDeletePieceCategory } from "@/app/(dashboard)/piece-categories/_hooks/usePieceCategoryMutations";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { PieceCategory } from "@/interfaces/pieceCategory";

export function PieceCategoryRowActions({
  pieceCategory,
}: {
  pieceCategory: PieceCategory;
}) {
  const t = useTranslations("pieceCategories");
  const common = useTranslations("common");
  const deletePieceCategory = useDeletePieceCategory();

  return (
    <div className="flex items-center justify-end gap-2">
      <PieceCategoryFormDialog
        pieceCategory={pieceCategory}
        trigger={
          <Button variant="outline" size="sm">
            <Pencil className="size-4" />
            {common("edit")}
          </Button>
        }
      />

      <ConfirmDialog
        title={t("deleteTitle")}
        description={t("deleteDescription", { name: pieceCategory.name })}
        confirmLabel={common("delete")}
        cancelLabel={common("cancel")}
        isConfirming={deletePieceCategory.isPending}
        onConfirm={() => deletePieceCategory.mutate(pieceCategory.id)}
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

"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { GlazeFormDialog } from "@/app/(dashboard)/glazes/_components/glaze-form-dialog";
import { useDeleteGlaze } from "@/app/(dashboard)/glazes/_hooks/useGlazeMutations";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Glaze } from "@/interfaces/glaze";

export function GlazeRowActions({ glaze }: { glaze: Glaze }) {
  const t = useTranslations("glazes");
  const common = useTranslations("common");
  const deleteGlaze = useDeleteGlaze();

  return (
    <div className="flex items-center justify-end gap-2">
      <GlazeFormDialog
        glaze={glaze}
        trigger={
          <Button variant="outline" size="sm">
            <Pencil className="size-4" />
            {common("edit")}
          </Button>
        }
      />

      <ConfirmDialog
        title={t("deleteTitle")}
        description={t("deleteDescription", { name: glaze.name })}
        confirmLabel={common("delete")}
        cancelLabel={common("cancel")}
        isConfirming={deleteGlaze.isPending}
        onConfirm={() => deleteGlaze.mutate(glaze.id)}
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

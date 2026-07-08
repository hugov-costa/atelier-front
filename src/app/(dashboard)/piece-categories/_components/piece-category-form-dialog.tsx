"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";

import {
  useCreatePieceCategory,
  useUpdatePieceCategory,
} from "@/app/(dashboard)/piece-categories/_hooks/usePieceCategoryMutations";
import {
  createPieceCategorySchema,
  PieceCategoryFormValues,
} from "@/app/(dashboard)/piece-categories/_schemas/pieceCategorySchema";
import { Form } from "@/components/form/form";
import { FormInput } from "@/components/form/form-fields";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import {
  CreatePieceCategoryPayload,
  PieceCategory,
} from "@/interfaces/pieceCategory";
import { decimalOnly } from "@/utils/inputSanitizers";

interface PieceCategoryFormDialogProps {
  pieceCategory?: PieceCategory;
  trigger: ReactNode;
}

export function PieceCategoryFormDialog({
  pieceCategory,
  trigger,
}: PieceCategoryFormDialogProps) {
  const t = useTranslations("pieceCategories");
  const common = useTranslations("common");
  const validation = useTranslations("validation");
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(pieceCategory);

  const form = useForm<PieceCategoryFormValues>({
    resolver: zodResolver(createPieceCategorySchema(validation)),
    defaultValues: toFormValues(pieceCategory),
    reValidateMode: "onSubmit",
  });

  const close = () => {
    setOpen(false);
    form.reset(toFormValues(pieceCategory));
  };

  const createMutation = useCreatePieceCategory({
    setError: form.setError,
    onSuccess: close,
  });
  const updateMutation = useUpdatePieceCategory({
    pieceCategoryId: pieceCategory?.id ?? "",
    setError: form.setError,
    onSuccess: close,
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: PieceCategoryFormValues) => {
    const payload = toPayload(values);

    if (pieceCategory) {
      updateMutation.mutate(payload);
      return;
    }

    createMutation.mutate(payload);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        form.reset(toFormValues(pieceCategory));
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("editTitle") : t("createTitle")}
          </DialogTitle>
          <DialogDescription>{t("formDescription")}</DialogDescription>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit}>
          <FieldGroup>
            <FormInput
              name="name"
              label={t("fieldName")}
              maxLength={255}
              disabled={isSubmitting}
            />
            <FormInput
              name="profit_margin"
              label={t("fieldProfitMargin")}
              description={t("fieldProfitMarginHelp")}
              inputMode="decimal"
              sanitize={decimalOnly}
              maxLength={8}
              disabled={isSubmitting}
            />
            <FormInput
              name="available_until"
              label={t("fieldAvailableUntil")}
              description={t("fieldAvailableUntilHelp")}
              type="date"
              disabled={isSubmitting}
            />
          </FieldGroup>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              disabled={isSubmitting}
              onClick={close}
            >
              {common("cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? common("saving") : common("save")}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function toFormValues(pieceCategory?: PieceCategory): PieceCategoryFormValues {
  return {
    available_until: pieceCategory?.available_until ?? "",
    name: pieceCategory?.name ?? "",
    profit_margin: pieceCategory ? String(pieceCategory.profit_margin) : "",
  };
}

function toPayload(
  values: PieceCategoryFormValues,
): CreatePieceCategoryPayload {
  return {
    available_until: values.available_until || null,
    name: values.name.trim(),
    profit_margin: Number(values.profit_margin),
  };
}

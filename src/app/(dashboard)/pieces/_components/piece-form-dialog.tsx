"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";

import {
  useCreatePiece,
  useUpdatePiece,
} from "@/app/(dashboard)/pieces/_hooks/usePieceMutations";
import {
  createPieceSchema,
  PieceFormValues,
} from "@/app/(dashboard)/pieces/_schemas/pieceSchema";
import { Form } from "@/components/form/form";
import {
  FormInput,
  FormMultiSelect,
  FormSelect,
} from "@/components/form/form-fields";
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
import { CreatePiecePayload, Piece } from "@/interfaces/piece";
import { PieceKind, pieceKinds } from "@/lib/enums";
import { queryKeys } from "@/lib/queryKeys";
import { toStudentOptions } from "@/lib/userOptions";
import { listClays } from "@/services/clayService";
import { listFiringCycles } from "@/services/firingCycleService";
import { listGlazes } from "@/services/glazeService";
import { listPieceCategories } from "@/services/pieceCategoryService";
import { listUsers } from "@/services/userService";
import { decimalOnly } from "@/utils/inputSanitizers";

const NONE = "none";
const OPTIONS_LIMIT = 100;

interface PieceFormDialogProps {
  piece?: Piece;
  trigger: ReactNode;
}

export function PieceFormDialog({ piece, trigger }: PieceFormDialogProps) {
  const t = useTranslations("pieces");
  const enumsT = useTranslations("enums");
  const common = useTranslations("common");
  const validation = useTranslations("validation");
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(piece);

  const form = useForm<PieceFormValues>({
    resolver: zodResolver(createPieceSchema(validation)),
    defaultValues: toFormValues(piece),
    reValidateMode: "onSubmit",
  });

  const claysQuery = useQuery({
    queryKey: queryKeys.claysList({ page: 1, perPage: OPTIONS_LIMIT }),
    queryFn: () => listClays({ page: 1, perPage: OPTIONS_LIMIT }),
    enabled: open && !isEdit,
  });
  const glazesQuery = useQuery({
    queryKey: queryKeys.glazesList({ page: 1, perPage: OPTIONS_LIMIT }),
    queryFn: () => listGlazes({ page: 1, perPage: OPTIONS_LIMIT }),
    enabled: open && !isEdit,
  });
  const pieceCategoriesQuery = useQuery({
    queryKey: queryKeys.pieceCategoriesList({
      page: 1,
      perPage: OPTIONS_LIMIT,
    }),
    queryFn: () => listPieceCategories({ page: 1, perPage: OPTIONS_LIMIT }),
    enabled: open && !isEdit,
  });
  const usersQuery = useQuery({
    queryKey: queryKeys.usersList({ page: 1, perPage: OPTIONS_LIMIT }),
    queryFn: () => listUsers({ page: 1, perPage: OPTIONS_LIMIT }),
    enabled: open && !isEdit,
  });
  const firingCyclesQuery = useQuery({
    queryKey: queryKeys.firingCyclesList({ page: 1, perPage: OPTIONS_LIMIT }),
    queryFn: () => listFiringCycles({ page: 1, perPage: OPTIONS_LIMIT }),
    enabled: open && !isEdit,
  });

  const clayOptions = (claysQuery.data?.data ?? []).map((clay) => ({
    label: clay.name,
    value: clay.id,
  }));
  const glazeOptions = [
    { label: t("optionNone"), value: NONE },
    ...(glazesQuery.data?.data ?? []).map((glaze) => ({
      label: glaze.name,
      value: glaze.id,
    })),
  ];
  const categoryOptions = [
    { label: t("optionNone"), value: NONE },
    ...(pieceCategoriesQuery.data?.data ?? []).map((category) => ({
      label: category.name,
      value: category.id,
    })),
  ];
  const userOptions = toStudentOptions(usersQuery.data?.data);
  const kindOptions = pieceKinds.map((kind) => ({
    label: enumsT(`pieceKind.${kind}`),
    value: kind,
  }));
  const firingCycleOptions = (firingCyclesQuery.data?.data ?? []).map(
    (firingCycle) => ({
      label: firingCycle.name,
      value: firingCycle.id,
    }),
  );

  const close = () => {
    setOpen(false);
    form.reset(toFormValues(piece));
  };

  const createMutation = useCreatePiece({
    setError: form.setError,
    onSuccess: close,
  });
  const updateMutation = useUpdatePiece({
    pieceId: piece?.id ?? "",
    setError: form.setError,
    onSuccess: close,
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: PieceFormValues) => {
    if (piece) {
      updateMutation.mutate({ name: values.name.trim() });
      return;
    }

    createMutation.mutate(toCreatePayload(values));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        form.reset(toFormValues(piece));
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("editTitle") : t("createTitle")}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? t("editDescription") : t("createDescription")}
          </DialogDescription>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit}>
          <FieldGroup>
            {isEdit ? (
              <>
                <p className="text-muted-foreground text-sm">
                  {t("editDescription")}
                </p>
                <FormInput
                  name="name"
                  label={t("fieldName")}
                  maxLength={255}
                  disabled={isSubmitting}
                />
              </>
            ) : (
              <>
                <FormInput
                  name="name"
                  label={t("fieldName")}
                  maxLength={255}
                  disabled={isSubmitting}
                />
                <FormSelect
                  name="kind"
                  label={t("fieldKind")}
                  options={kindOptions}
                  disabled={isSubmitting}
                />
                <FormSelect
                  name="clay_id"
                  label={t("fieldClay")}
                  options={clayOptions}
                  disabled={isSubmitting}
                />
                <FormInput
                  name="clay_amount"
                  label={t("fieldClayAmount")}
                  inputMode="decimal"
                  sanitize={decimalOnly}
                  maxLength={8}
                  disabled={isSubmitting}
                />
                <FormSelect
                  name="glaze_id"
                  label={t("fieldGlaze")}
                  options={glazeOptions}
                  disabled={isSubmitting}
                />
                <FormInput
                  name="glaze_amount"
                  label={t("fieldGlazeAmount")}
                  description={t("fieldGlazeAmountHelp")}
                  inputMode="decimal"
                  sanitize={decimalOnly}
                  maxLength={8}
                  disabled={isSubmitting}
                />
                <FormSelect
                  name="piece_category_id"
                  label={t("fieldCategory")}
                  options={categoryOptions}
                  disabled={isSubmitting}
                />
                <FormSelect
                  name="user_id"
                  label={t("fieldUser")}
                  options={userOptions}
                  disabled={isSubmitting}
                />
                <FormMultiSelect
                  name="firing_cycle_ids"
                  label={t("fieldFiringCycles")}
                  options={firingCycleOptions}
                  emptyMessage={t("fieldFiringCyclesEmpty")}
                />
              </>
            )}
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

function toCreatePayload(values: PieceFormValues): CreatePiecePayload {
  const glazeId =
    values.glaze_id && values.glaze_id !== NONE ? values.glaze_id : null;
  const categoryId =
    values.piece_category_id && values.piece_category_id !== NONE
      ? values.piece_category_id
      : null;

  return {
    clay_amount: Number(values.clay_amount),
    clay_id: values.clay_id,
    firing_cycle_ids: values.firing_cycle_ids,
    glaze_amount: glazeId ? Number(values.glaze_amount) : null,
    glaze_id: glazeId,
    kind: values.kind as PieceKind,
    name: values.name.trim(),
    piece_category_id: categoryId,
    user_id: values.user_id,
  };
}

function toFormValues(piece?: Piece): PieceFormValues {
  return {
    clay_amount: piece ? String(piece.clay_amount) : "",
    clay_id: piece?.clay_id ?? "",
    firing_cycle_ids: piece?.firing_cycles?.map((cycle) => cycle.id) ?? [],
    glaze_amount: piece?.glaze_amount != null ? String(piece.glaze_amount) : "",
    glaze_id: piece?.glaze_id ?? NONE,
    kind: piece?.kind ?? "",
    name: piece?.name ?? "",
    piece_category_id: piece?.piece_category_id ?? NONE,
    user_id: piece?.user_id ?? "",
  };
}

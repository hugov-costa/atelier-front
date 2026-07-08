"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";

import {
  useCreateGlaze,
  useUpdateGlaze,
} from "@/app/(dashboard)/glazes/_hooks/useGlazeMutations";
import {
  createGlazeSchema,
  GlazeFormValues,
} from "@/app/(dashboard)/glazes/_schemas/glazeSchema";
import { Form } from "@/components/form/form";
import {
  FormCurrencyInput,
  FormInput,
  FormSelect,
  FormTextarea,
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
import { CreateGlazePayload, Glaze } from "@/interfaces/glaze";
import { queryKeys } from "@/lib/queryKeys";
import { listGlazeSuppliers } from "@/services/glazeSupplierService";
import { centsFromMaskedInput, maskedInputFromCents } from "@/utils/formatters";

const SUPPLIER_OPTIONS_LIMIT = 100;

interface GlazeFormDialogProps {
  glaze?: Glaze;
  trigger: ReactNode;
}

export function GlazeFormDialog({ glaze, trigger }: GlazeFormDialogProps) {
  const t = useTranslations("glazes");
  const common = useTranslations("common");
  const validation = useTranslations("validation");
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(glaze);

  const suppliersQuery = useQuery({
    queryKey: queryKeys.glazeSuppliersList({
      page: 1,
      perPage: SUPPLIER_OPTIONS_LIMIT,
    }),
    queryFn: () =>
      listGlazeSuppliers({ page: 1, perPage: SUPPLIER_OPTIONS_LIMIT }),
    enabled: open,
  });

  const supplierOptions = (suppliersQuery.data?.data ?? []).map((supplier) => ({
    label: supplier.name,
    value: supplier.id,
  }));

  const form = useForm<GlazeFormValues>({
    resolver: zodResolver(createGlazeSchema(validation)),
    defaultValues: toFormValues(glaze),
    reValidateMode: "onSubmit",
  });

  const close = () => {
    setOpen(false);
    form.reset(toFormValues(glaze));
  };

  const createMutation = useCreateGlaze({
    setError: form.setError,
    onSuccess: close,
  });
  const updateMutation = useUpdateGlaze({
    glazeId: glaze?.id ?? "",
    setError: form.setError,
    onSuccess: close,
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: GlazeFormValues) => {
    const payload = toPayload(values);

    if (glaze) {
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
        form.reset(toFormValues(glaze));
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
            <FormSelect
              name="glaze_supplier_id"
              label={t("fieldSupplier")}
              placeholder={t("fieldSupplierPlaceholder")}
              options={supplierOptions}
            />
            <FormCurrencyInput
              name="price"
              label={t("fieldPrice")}
              description={t("fieldPriceHelp")}
              maxLength={12}
              disabled={isSubmitting}
            />
            <FormTextarea
              name="description"
              label={t("fieldDescription")}
              maxLength={1000}
              rows={3}
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

function toFormValues(glaze?: Glaze): GlazeFormValues {
  return {
    description: glaze?.description ?? "",
    glaze_supplier_id: glaze?.glaze_supplier_id ?? "",
    name: glaze?.name ?? "",
    price: maskedInputFromCents(glaze?.price),
  };
}

function toPayload(values: GlazeFormValues): CreateGlazePayload {
  return {
    description: values.description.trim() || null,
    glaze_supplier_id: values.glaze_supplier_id,
    name: values.name.trim(),
    price: centsFromMaskedInput(values.price),
  };
}

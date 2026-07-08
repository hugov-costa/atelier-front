"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";

import {
  useCreateClay,
  useUpdateClay,
} from "@/app/(dashboard)/clays/_hooks/useClayMutations";
import {
  ClayFormValues,
  createClaySchema,
} from "@/app/(dashboard)/clays/_schemas/claySchema";
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
import { Clay, CreateClayPayload } from "@/interfaces/clay";
import { queryKeys } from "@/lib/queryKeys";
import { listClaySuppliers } from "@/services/claySupplierService";
import { centsFromMaskedInput, maskedInputFromCents } from "@/utils/formatters";

const SUPPLIER_OPTIONS_LIMIT = 100;

interface ClayFormDialogProps {
  clay?: Clay;
  trigger: ReactNode;
}

export function ClayFormDialog({ clay, trigger }: ClayFormDialogProps) {
  const t = useTranslations("clays");
  const common = useTranslations("common");
  const validation = useTranslations("validation");
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(clay);

  const suppliersQuery = useQuery({
    queryKey: queryKeys.claySuppliersList({
      page: 1,
      perPage: SUPPLIER_OPTIONS_LIMIT,
    }),
    queryFn: () =>
      listClaySuppliers({ page: 1, perPage: SUPPLIER_OPTIONS_LIMIT }),
    enabled: open,
  });

  const supplierOptions = (suppliersQuery.data?.data ?? []).map((supplier) => ({
    label: supplier.name,
    value: supplier.id,
  }));

  const form = useForm<ClayFormValues>({
    resolver: zodResolver(createClaySchema(validation)),
    defaultValues: toFormValues(clay),
    reValidateMode: "onSubmit",
  });

  const close = () => {
    setOpen(false);
    form.reset(toFormValues(clay));
  };

  const createMutation = useCreateClay({
    setError: form.setError,
    onSuccess: close,
  });
  const updateMutation = useUpdateClay({
    clayId: clay?.id ?? "",
    setError: form.setError,
    onSuccess: close,
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: ClayFormValues) => {
    const payload = toPayload(values);

    if (clay) {
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
        form.reset(toFormValues(clay));
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
              name="clay_supplier_id"
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

function toFormValues(clay?: Clay): ClayFormValues {
  return {
    clay_supplier_id: clay?.clay_supplier_id ?? "",
    description: clay?.description ?? "",
    name: clay?.name ?? "",
    price: maskedInputFromCents(clay?.price),
  };
}

function toPayload(values: ClayFormValues): CreateClayPayload {
  return {
    clay_supplier_id: values.clay_supplier_id,
    description: values.description.trim() || null,
    name: values.name.trim(),
    price: centsFromMaskedInput(values.price),
  };
}

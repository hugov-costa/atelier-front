"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ReactNode, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import {
  useCreateMaterialPurchase,
  useUpdateMaterialPurchase,
} from "@/app/(dashboard)/material-purchases/_hooks/useMaterialPurchaseMutations";
import {
  createMaterialPurchaseSchema,
  MaterialPurchaseFormValues,
} from "@/app/(dashboard)/material-purchases/_schemas/materialPurchaseSchema";
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
import {
  CreateMaterialPurchasePayload,
  MaterialPurchase,
  UpdateMaterialPurchasePayload,
} from "@/interfaces/materialPurchase";
import {
  MaterialType,
  materialTypes,
  PaymentMethod,
  paymentMethods,
} from "@/lib/enums";
import { queryKeys } from "@/lib/queryKeys";
import { listClays } from "@/services/clayService";
import { listGlazes } from "@/services/glazeService";
import { centsFromMaskedInput, maskedInputFromCents } from "@/utils/formatters";
import { decimalOnly } from "@/utils/inputSanitizers";

const MATERIAL_OPTIONS_LIMIT = 100;

interface MaterialPurchaseFormDialogProps {
  materialPurchase?: MaterialPurchase;
  trigger: ReactNode;
}

export function MaterialPurchaseFormDialog({
  materialPurchase,
  trigger,
}: MaterialPurchaseFormDialogProps) {
  const t = useTranslations("materialPurchases");
  const enumsT = useTranslations("enums");
  const common = useTranslations("common");
  const validation = useTranslations("validation");
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(materialPurchase);

  const form = useForm<MaterialPurchaseFormValues>({
    resolver: zodResolver(createMaterialPurchaseSchema(validation)),
    defaultValues: toFormValues(materialPurchase),
    reValidateMode: "onSubmit",
  });

  const materialType = useWatch({
    control: form.control,
    name: "material_type",
  });

  const claysQuery = useQuery({
    queryKey: queryKeys.claysList({ page: 1, perPage: MATERIAL_OPTIONS_LIMIT }),
    queryFn: () => listClays({ page: 1, perPage: MATERIAL_OPTIONS_LIMIT }),
    enabled: open && !isEdit && materialType === "clay",
  });
  const glazesQuery = useQuery({
    queryKey: queryKeys.glazesList({
      page: 1,
      perPage: MATERIAL_OPTIONS_LIMIT,
    }),
    queryFn: () => listGlazes({ page: 1, perPage: MATERIAL_OPTIONS_LIMIT }),
    enabled: open && !isEdit && materialType === "glaze",
  });

  const materialSource =
    materialType === "clay"
      ? claysQuery.data?.data
      : materialType === "glaze"
        ? glazesQuery.data?.data
        : [];
  const materialOptions = (materialSource ?? []).map((material) => ({
    label: material.name,
    value: material.id,
  }));

  const materialTypeOptions = materialTypes.map((value) => ({
    label: enumsT(`materialType.${value}`),
    value,
  }));
  const paymentMethodOptions = paymentMethods.map((value) => ({
    label: enumsT(`paymentMethod.${value}`),
    value,
  }));

  useEffect(() => {
    if (!isEdit) {
      form.setValue("material_id", "");
    }
  }, [materialType, isEdit, form]);

  const close = () => {
    setOpen(false);
    form.reset(toFormValues(materialPurchase));
  };

  const createMutation = useCreateMaterialPurchase({
    setError: form.setError,
    onSuccess: close,
  });
  const updateMutation = useUpdateMaterialPurchase({
    materialPurchaseId: materialPurchase?.id ?? "",
    setError: form.setError,
    onSuccess: close,
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: MaterialPurchaseFormValues) => {
    if (materialPurchase) {
      updateMutation.mutate(toUpdatePayload(values));
      return;
    }

    createMutation.mutate(toCreatePayload(values));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        form.reset(toFormValues(materialPurchase));
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? t("editTitle") : t("createTitle")}
          </DialogTitle>
          <DialogDescription>{t("formDescription")}</DialogDescription>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit}>
          <FieldGroup>
            {isEdit ? (
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">{t("fieldMaterial")}</p>
                <p className="font-medium">
                  {t("materialLabel", {
                    name: materialPurchase?.material.name ?? "—",
                    type: enumsT(
                      `materialType.${materialPurchase?.material.type}`,
                    ),
                  })}
                </p>
              </div>
            ) : (
              <>
                <FormSelect
                  name="material_type"
                  label={t("fieldMaterialType")}
                  placeholder={t("fieldMaterialType")}
                  options={materialTypeOptions}
                  disabled={isSubmitting}
                />
                <FormSelect
                  name="material_id"
                  label={t("fieldMaterial")}
                  placeholder={
                    materialType
                      ? t("fieldMaterialPlaceholder")
                      : t("fieldMaterialTypeFirst")
                  }
                  options={materialOptions}
                  disabled={isSubmitting || !materialType}
                />
              </>
            )}
            <FormSelect
              name="payment_method"
              label={t("fieldPaymentMethod")}
              placeholder={t("fieldPaymentMethod")}
              options={paymentMethodOptions}
              disabled={isSubmitting}
            />
            <FormInput
              name="quantity"
              label={t("fieldQuantity")}
              description={t("fieldQuantityHelp")}
              inputMode="decimal"
              sanitize={decimalOnly}
              maxLength={10}
              disabled={isSubmitting}
            />
            <FormCurrencyInput
              name="unit_price"
              label={t("fieldUnitPrice")}
              description={t("fieldUnitPriceHelp")}
              maxLength={12}
              disabled={isSubmitting}
            />
            <FormCurrencyInput
              name="total_price"
              label={t("fieldTotalPrice")}
              description={t("fieldTotalPriceHelp")}
              maxLength={12}
              disabled={isSubmitting}
            />
            <FormCurrencyInput
              name="freight"
              label={t("fieldFreight")}
              maxLength={12}
              disabled={isSubmitting}
            />
            <FormInput
              name="purchase_date"
              label={t("fieldPurchaseDate")}
              type="date"
              disabled={isSubmitting}
            />
            <FormInput
              name="receipt_date"
              label={t("fieldReceiptDate")}
              description={t("fieldReceiptDateHelp")}
              type="date"
              disabled={isSubmitting}
            />
            <FormInput
              name="invoice_number"
              label={t("fieldInvoiceNumber")}
              maxLength={255}
              disabled={isSubmitting}
            />
            <FormInput
              name="lot"
              label={t("fieldLot")}
              maxLength={255}
              disabled={isSubmitting}
            />
            <FormTextarea
              name="description"
              label={t("fieldDescription")}
              maxLength={1000}
              rows={2}
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

function toCreatePayload(
  values: MaterialPurchaseFormValues,
): CreateMaterialPurchasePayload {
  return {
    description: values.description.trim() || null,
    freight: values.freight ? centsFromMaskedInput(values.freight) : 0,
    invoice_number: values.invoice_number.trim() || null,
    lot: values.lot.trim() || null,
    material_id: values.material_id,
    material_type: values.material_type as MaterialType,
    payment_method: values.payment_method as PaymentMethod,
    purchase_date: values.purchase_date,
    quantity: Number(values.quantity),
    receipt_date: values.receipt_date || null,
    total_price: centsFromMaskedInput(values.total_price),
    unit_price: centsFromMaskedInput(values.unit_price),
  };
}

function toFormValues(
  materialPurchase?: MaterialPurchase,
): MaterialPurchaseFormValues {
  return {
    description: materialPurchase?.description ?? "",
    freight: maskedInputFromCents(materialPurchase?.freight),
    invoice_number: materialPurchase?.invoice_number ?? "",
    lot: materialPurchase?.lot ?? "",
    material_id: materialPurchase?.material.id ?? "",
    material_type: materialPurchase?.material.type ?? "",
    payment_method: materialPurchase?.payment_method ?? "",
    purchase_date: materialPurchase?.purchase_date ?? "",
    quantity: materialPurchase ? String(materialPurchase.quantity) : "",
    receipt_date: materialPurchase?.receipt_date ?? "",
    total_price: maskedInputFromCents(materialPurchase?.total_price),
    unit_price: maskedInputFromCents(materialPurchase?.unit_price),
  };
}

function toUpdatePayload(
  values: MaterialPurchaseFormValues,
): UpdateMaterialPurchasePayload {
  return {
    description: values.description.trim() || null,
    freight: values.freight ? centsFromMaskedInput(values.freight) : 0,
    invoice_number: values.invoice_number.trim() || null,
    lot: values.lot.trim() || null,
    payment_method: values.payment_method as PaymentMethod,
    purchase_date: values.purchase_date,
    quantity: Number(values.quantity),
    receipt_date: values.receipt_date || null,
    total_price: centsFromMaskedInput(values.total_price),
    unit_price: centsFromMaskedInput(values.unit_price),
  };
}

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";

import {
  useCreateCommissionOrder,
  useUpdateCommissionOrder,
} from "@/app/(dashboard)/commission-orders/_hooks/useCommissionOrderMutations";
import {
  CommissionOrderFormValues,
  createCommissionOrderSchema,
} from "@/app/(dashboard)/commission-orders/_schemas/commissionOrderSchema";
import { Form } from "@/components/form/form";
import {
  FormCurrencyInput,
  FormInput,
  FormMultiSelect,
  FormSelect,
  FormSwitch,
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
  CommissionOrder,
  CreateCommissionOrderPayload,
  UpdateCommissionOrderPayload,
} from "@/interfaces/commissionOrder";
import { OrderStatus, orderStatuses } from "@/lib/enums";
import { queryKeys } from "@/lib/queryKeys";
import { listCustomers } from "@/services/customerService";
import { listPieces } from "@/services/pieceService";
import { centsFromMaskedInput, maskedInputFromCents } from "@/utils/formatters";

const OPTIONS_LIMIT = 100;

interface CommissionOrderFormDialogProps {
  commissionOrder?: CommissionOrder;
  trigger: ReactNode;
}

export function CommissionOrderFormDialog({
  commissionOrder,
  trigger,
}: CommissionOrderFormDialogProps) {
  const t = useTranslations("commissionOrders");
  const enumsT = useTranslations("enums");
  const common = useTranslations("common");
  const validation = useTranslations("validation");
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(commissionOrder);

  const form = useForm<CommissionOrderFormValues>({
    resolver: zodResolver(createCommissionOrderSchema(validation)),
    defaultValues: toFormValues(commissionOrder),
    reValidateMode: "onSubmit",
  });

  const customersQuery = useQuery({
    queryKey: queryKeys.customersList({ page: 1, perPage: OPTIONS_LIMIT }),
    queryFn: () => listCustomers({ page: 1, perPage: OPTIONS_LIMIT }),
    enabled: open && !isEdit,
  });
  const piecesQuery = useQuery({
    queryKey: queryKeys.piecesList({ page: 1, perPage: OPTIONS_LIMIT }),
    queryFn: () => listPieces({ page: 1, perPage: OPTIONS_LIMIT }),
    enabled: open,
  });

  const customerOptions = (customersQuery.data?.data ?? []).map((customer) => ({
    label: customer.name,
    value: customer.id,
  }));
  const pieceOptions = (piecesQuery.data?.data ?? [])
    .filter((piece) => piece.kind === "commission")
    .map((piece) => ({ label: piece.name, value: piece.id }));
  const statusOptions = orderStatuses.map((status) => ({
    label: enumsT(`orderStatus.${status}`),
    value: status,
  }));

  const close = () => {
    setOpen(false);
    form.reset(toFormValues(commissionOrder));
  };

  const createMutation = useCreateCommissionOrder({
    setError: form.setError,
    onSuccess: close,
  });
  const updateMutation = useUpdateCommissionOrder({
    commissionOrderId: commissionOrder?.id ?? "",
    setError: form.setError,
    onSuccess: close,
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: CommissionOrderFormValues) => {
    if (commissionOrder) {
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
        form.reset(toFormValues(commissionOrder));
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
              <div className="space-y-1 text-sm">
                <p className="text-muted-foreground">{t("customerReadonly")}</p>
                <p className="font-medium">
                  {commissionOrder?.customer?.name ?? "—"}
                </p>
              </div>
            ) : (
              <FormSelect
                name="customer_id"
                label={t("fieldCustomer")}
                placeholder={t("fieldCustomer")}
                options={customerOptions}
                disabled={isSubmitting}
              />
            )}
            <FormInput
              name="order_date"
              label={t("fieldOrderDate")}
              type="date"
              disabled={isSubmitting}
            />
            <FormInput
              name="delivery_date"
              label={t("fieldDeliveryDate")}
              description={t("fieldDeliveryDateHelp")}
              type="date"
              disabled={isSubmitting}
            />
            <FormSelect
              name="status"
              label={t("fieldStatus")}
              placeholder={t("fieldStatus")}
              options={statusOptions}
              disabled={isSubmitting}
            />
            <FormMultiSelect
              name="piece_ids"
              label={t("fieldPieces")}
              options={pieceOptions}
              emptyMessage={t("fieldPiecesEmpty")}
            />
            <FormCurrencyInput
              name="shipping_charged"
              label={t("fieldShippingCharged")}
              description={t("fieldShippingChargedHelp")}
              maxLength={12}
              disabled={isSubmitting}
            />
            <FormCurrencyInput
              name="shipping_cost"
              label={t("fieldShippingCost")}
              description={t("fieldShippingCostHelp")}
              maxLength={12}
              disabled={isSubmitting}
            />
            <FormCurrencyInput
              name="sale_total_override"
              label={t("fieldSaleTotalOverride")}
              description={t("fieldSaleTotalOverrideHelp")}
              maxLength={12}
              disabled={isSubmitting}
            />
            <FormTextarea
              name="description"
              label={t("fieldDescription")}
              maxLength={1000}
              rows={2}
              disabled={isSubmitting}
            />
            {isEdit ? (
              <FormSwitch
                name="is_paid"
                label={t("fieldIsPaid")}
                description={t("fieldIsPaidHelp")}
              />
            ) : null}
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
  values: CommissionOrderFormValues,
): CreateCommissionOrderPayload {
  return {
    customer_id: values.customer_id,
    delivery_date: values.delivery_date || null,
    description: values.description.trim() || null,
    order_date: values.order_date,
    piece_ids: values.piece_ids,
    sale_total_override: values.sale_total_override
      ? centsFromMaskedInput(values.sale_total_override)
      : null,
    shipping_charged: values.shipping_charged
      ? centsFromMaskedInput(values.shipping_charged)
      : 0,
    shipping_cost: values.shipping_cost
      ? centsFromMaskedInput(values.shipping_cost)
      : 0,
    status: values.status as OrderStatus,
  };
}

function toFormValues(
  commissionOrder?: CommissionOrder,
): CommissionOrderFormValues {
  return {
    customer_id: commissionOrder?.customer?.id ?? "",
    delivery_date: commissionOrder?.delivery_date ?? "",
    description: commissionOrder?.description ?? "",
    is_paid: commissionOrder?.is_paid ?? false,
    order_date: commissionOrder?.order_date ?? "",
    piece_ids: commissionOrder?.pieces?.map((piece) => piece.id) ?? [],
    sale_total_override: maskedInputFromCents(
      commissionOrder?.sale_total_override,
    ),
    shipping_charged: maskedInputFromCents(commissionOrder?.shipping_charged),
    shipping_cost: maskedInputFromCents(commissionOrder?.shipping_cost),
    status: commissionOrder?.status ?? "pending",
  };
}

function toUpdatePayload(
  values: CommissionOrderFormValues,
): UpdateCommissionOrderPayload {
  return {
    delivery_date: values.delivery_date || null,
    description: values.description.trim() || null,
    is_paid: values.is_paid,
    order_date: values.order_date,
    piece_ids: values.piece_ids,
    sale_total_override: values.sale_total_override
      ? centsFromMaskedInput(values.sale_total_override)
      : null,
    shipping_charged: values.shipping_charged
      ? centsFromMaskedInput(values.shipping_charged)
      : 0,
    shipping_cost: values.shipping_cost
      ? centsFromMaskedInput(values.shipping_cost)
      : 0,
    status: values.status as OrderStatus,
  };
}

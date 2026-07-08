"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";

import {
  useCreateBill,
  useUpdateBill,
} from "@/app/(dashboard)/bills/_hooks/useBillMutations";
import {
  BillFormValues,
  createBillSchema,
} from "@/app/(dashboard)/bills/_schemas/billSchema";
import { Form } from "@/components/form/form";
import {
  FormCurrencyInput,
  FormInput,
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
import { Bill, CreateBillPayload, UpdateBillPayload } from "@/interfaces/bill";
import { Month, months } from "@/lib/enums";
import { centsFromMaskedInput, maskedInputFromCents } from "@/utils/formatters";
import { digitsOnly } from "@/utils/inputSanitizers";

interface BillFormDialogProps {
  bill?: Bill;
  trigger: ReactNode;
}

export function BillFormDialog({ bill, trigger }: BillFormDialogProps) {
  const t = useTranslations("bills");
  const enumsT = useTranslations("enums");
  const common = useTranslations("common");
  const validation = useTranslations("validation");
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(bill);

  const form = useForm<BillFormValues>({
    resolver: zodResolver(createBillSchema(validation)),
    defaultValues: toFormValues(bill),
    reValidateMode: "onSubmit",
  });

  const monthOptions = months.map((month) => ({
    label: enumsT(`month.${month}`),
    value: String(month),
  }));

  const close = () => {
    setOpen(false);
    form.reset(toFormValues(bill));
  };

  const createMutation = useCreateBill({
    setError: form.setError,
    onSuccess: close,
  });
  const updateMutation = useUpdateBill({
    billId: bill?.id ?? "",
    setError: form.setError,
    onSuccess: close,
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: BillFormValues) => {
    if (bill) {
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
        form.reset(toFormValues(bill));
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
            <FormInput
              name="name"
              label={t("fieldName")}
              maxLength={255}
              disabled={isSubmitting}
            />
            <FormCurrencyInput
              name="value"
              label={t("fieldValue")}
              maxLength={12}
              disabled={isSubmitting}
            />
            <FormSelect
              name="reference_month"
              label={t("fieldReferenceMonth")}
              placeholder={t("fieldReferenceMonth")}
              options={monthOptions}
              disabled={isSubmitting}
            />
            <FormInput
              name="reference_year"
              label={t("fieldReferenceYear")}
              inputMode="numeric"
              sanitize={digitsOnly}
              maxLength={4}
              disabled={isSubmitting}
            />
            <FormInput
              name="due_date"
              label={t("fieldDueDate")}
              description={t("fieldDueDateHelp")}
              type="date"
              disabled={isSubmitting}
            />
            <FormSwitch
              name="is_recurrent"
              label={t("fieldRecurrent")}
              description={t("fieldRecurrentHelp")}
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

function toCreatePayload(values: BillFormValues): CreateBillPayload {
  return {
    description: values.description.trim() || null,
    due_date: values.due_date,
    is_recurrent: values.is_recurrent,
    name: values.name.trim(),
    reference_month: Number(values.reference_month) as Month,
    reference_year: Number(values.reference_year),
    value: centsFromMaskedInput(values.value),
  };
}

function toFormValues(bill?: Bill): BillFormValues {
  return {
    description: bill?.description ?? "",
    due_date: bill?.due_date ?? "",
    is_recurrent: bill?.is_recurrent ?? false,
    name: bill?.name ?? "",
    reference_month: bill ? String(bill.reference_month) : "",
    reference_year: bill ? String(bill.reference_year) : "",
    value: maskedInputFromCents(bill?.value),
  };
}

function toUpdatePayload(values: BillFormValues): UpdateBillPayload {
  return {
    description: values.description.trim() || null,
    due_date: values.due_date,
    is_recurrent: values.is_recurrent,
    name: values.name.trim(),
    reference_month: Number(values.reference_month) as Month,
    reference_year: Number(values.reference_year),
    value: centsFromMaskedInput(values.value),
  };
}

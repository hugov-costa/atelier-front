"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";

import {
  useCreateCustomer,
  useUpdateCustomer,
} from "@/app/(dashboard)/customers/_hooks/useCustomerMutations";
import {
  createCustomerSchema,
  CustomerFormValues,
} from "@/app/(dashboard)/customers/_schemas/customerSchema";
import { Form } from "@/components/form/form";
import { FormInput, FormTextarea } from "@/components/form/form-fields";
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
import { CreateCustomerPayload, Customer } from "@/interfaces/customer";
import { digitsOnly } from "@/utils/inputSanitizers";

interface CustomerFormDialogProps {
  customer?: Customer;
  trigger: ReactNode;
}

export function CustomerFormDialog({
  customer,
  trigger,
}: CustomerFormDialogProps) {
  const t = useTranslations("customers");
  const common = useTranslations("common");
  const validation = useTranslations("validation");
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(customer);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(createCustomerSchema(validation)),
    defaultValues: toFormValues(customer),
    reValidateMode: "onSubmit",
  });

  const close = () => {
    setOpen(false);
    form.reset(toFormValues(customer));
  };

  const createMutation = useCreateCustomer({
    setError: form.setError,
    onSuccess: close,
  });
  const updateMutation = useUpdateCustomer({
    customerId: customer?.id ?? "",
    setError: form.setError,
    onSuccess: close,
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: CustomerFormValues) => {
    const payload = toPayload(values);

    if (customer) {
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
        form.reset(toFormValues(customer));
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
              name="email"
              type="email"
              label={t("fieldEmail")}
              maxLength={255}
              disabled={isSubmitting}
            />
            <FormInput
              name="phone"
              label={t("fieldPhone")}
              inputMode="numeric"
              sanitize={digitsOnly}
              maxLength={11}
              disabled={isSubmitting}
            />
            <FormTextarea
              name="description"
              label={t("fieldDescription")}
              description={t("fieldDescriptionHelp")}
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

function toFormValues(customer?: Customer): CustomerFormValues {
  return {
    description: customer?.description ?? "",
    email: customer?.email ?? "",
    name: customer?.name ?? "",
    phone: customer?.phone ?? "",
  };
}

function toPayload(values: CustomerFormValues): CreateCustomerPayload {
  return {
    description: values.description.trim() || null,
    email: values.email.trim() || null,
    name: values.name.trim(),
    phone: values.phone.trim() || null,
  };
}

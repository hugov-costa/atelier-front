"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";

import {
  useCreateClaySupplier,
  useUpdateClaySupplier,
} from "@/app/(dashboard)/clay-suppliers/_hooks/useClaySupplierMutations";
import {
  ClaySupplierFormValues,
  createClaySupplierSchema,
} from "@/app/(dashboard)/clay-suppliers/_schemas/claySupplierSchema";
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
  ClaySupplier,
  CreateClaySupplierPayload,
} from "@/interfaces/claySupplier";
import { digitsOnly } from "@/utils/inputSanitizers";

interface ClaySupplierFormDialogProps {
  claySupplier?: ClaySupplier;
  trigger: ReactNode;
}

export function ClaySupplierFormDialog({
  claySupplier,
  trigger,
}: ClaySupplierFormDialogProps) {
  const t = useTranslations("claySuppliers");
  const common = useTranslations("common");
  const validation = useTranslations("validation");
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(claySupplier);

  const form = useForm<ClaySupplierFormValues>({
    resolver: zodResolver(createClaySupplierSchema(validation)),
    defaultValues: toFormValues(claySupplier),
    reValidateMode: "onSubmit",
  });

  const close = () => {
    setOpen(false);
    form.reset(toFormValues(claySupplier));
  };

  const createMutation = useCreateClaySupplier({
    setError: form.setError,
    onSuccess: close,
  });
  const updateMutation = useUpdateClaySupplier({
    claySupplierId: claySupplier?.id ?? "",
    setError: form.setError,
    onSuccess: close,
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: ClaySupplierFormValues) => {
    const payload = toPayload(values);

    if (claySupplier) {
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
        form.reset(toFormValues(claySupplier));
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
              description={t("fieldPhoneHelp")}
              inputMode="numeric"
              sanitize={digitsOnly}
              maxLength={11}
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

function toFormValues(claySupplier?: ClaySupplier): ClaySupplierFormValues {
  return {
    email: claySupplier?.email ?? "",
    name: claySupplier?.name ?? "",
    phone: claySupplier?.phone ?? "",
  };
}

function toPayload(values: ClaySupplierFormValues): CreateClaySupplierPayload {
  return {
    email: values.email.trim(),
    name: values.name.trim(),
    phone: values.phone.trim(),
  };
}

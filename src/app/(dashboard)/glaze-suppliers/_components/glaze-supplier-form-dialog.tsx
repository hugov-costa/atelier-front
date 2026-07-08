"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";

import {
  useCreateGlazeSupplier,
  useUpdateGlazeSupplier,
} from "@/app/(dashboard)/glaze-suppliers/_hooks/useGlazeSupplierMutations";
import {
  GlazeSupplierFormValues,
  createGlazeSupplierSchema,
} from "@/app/(dashboard)/glaze-suppliers/_schemas/glazeSupplierSchema";
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
  GlazeSupplier,
  CreateGlazeSupplierPayload,
} from "@/interfaces/glazeSupplier";
import { digitsOnly } from "@/utils/inputSanitizers";

interface GlazeSupplierFormDialogProps {
  glazeSupplier?: GlazeSupplier;
  trigger: ReactNode;
}

export function GlazeSupplierFormDialog({
  glazeSupplier,
  trigger,
}: GlazeSupplierFormDialogProps) {
  const t = useTranslations("glazeSuppliers");
  const common = useTranslations("common");
  const validation = useTranslations("validation");
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(glazeSupplier);

  const form = useForm<GlazeSupplierFormValues>({
    resolver: zodResolver(createGlazeSupplierSchema(validation)),
    defaultValues: toFormValues(glazeSupplier),
    reValidateMode: "onSubmit",
  });

  const close = () => {
    setOpen(false);
    form.reset(toFormValues(glazeSupplier));
  };

  const createMutation = useCreateGlazeSupplier({
    setError: form.setError,
    onSuccess: close,
  });
  const updateMutation = useUpdateGlazeSupplier({
    glazeSupplierId: glazeSupplier?.id ?? "",
    setError: form.setError,
    onSuccess: close,
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: GlazeSupplierFormValues) => {
    const payload = toPayload(values);

    if (glazeSupplier) {
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
        form.reset(toFormValues(glazeSupplier));
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

function toFormValues(glazeSupplier?: GlazeSupplier): GlazeSupplierFormValues {
  return {
    email: glazeSupplier?.email ?? "",
    name: glazeSupplier?.name ?? "",
    phone: glazeSupplier?.phone ?? "",
  };
}

function toPayload(
  values: GlazeSupplierFormValues,
): CreateGlazeSupplierPayload {
  return {
    email: values.email.trim(),
    name: values.name.trim(),
    phone: values.phone.trim(),
  };
}

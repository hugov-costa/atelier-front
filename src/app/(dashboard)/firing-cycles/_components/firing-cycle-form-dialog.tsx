"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";

import {
  useCreateFiringCycle,
  useUpdateFiringCycle,
} from "@/app/(dashboard)/firing-cycles/_hooks/useFiringCycleMutations";
import {
  FiringCycleFormValues,
  createFiringCycleSchema,
} from "@/app/(dashboard)/firing-cycles/_schemas/firingCycleSchema";
import { Form } from "@/components/form/form";
import { FormCurrencyInput, FormInput } from "@/components/form/form-fields";
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
  CreateFiringCyclePayload,
  FiringCycle,
} from "@/interfaces/firingCycle";
import { centsFromMaskedInput, maskedInputFromCents } from "@/utils/formatters";
import { decimalOnly, digitsOnly } from "@/utils/inputSanitizers";

interface FiringCycleFormDialogProps {
  firingCycle?: FiringCycle;
  trigger: ReactNode;
}

export function FiringCycleFormDialog({
  firingCycle,
  trigger,
}: FiringCycleFormDialogProps) {
  const t = useTranslations("firingCycles");
  const common = useTranslations("common");
  const validation = useTranslations("validation");
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(firingCycle);

  const form = useForm<FiringCycleFormValues>({
    resolver: zodResolver(createFiringCycleSchema(validation)),
    defaultValues: toFormValues(firingCycle),
    reValidateMode: "onSubmit",
  });

  const close = () => {
    setOpen(false);
    form.reset(toFormValues(firingCycle));
  };

  const createMutation = useCreateFiringCycle({
    setError: form.setError,
    onSuccess: close,
  });
  const updateMutation = useUpdateFiringCycle({
    firingCycleId: firingCycle?.id ?? "",
    setError: form.setError,
    onSuccess: close,
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: FiringCycleFormValues) => {
    const payload = toPayload(values);

    if (firingCycle) {
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
        form.reset(toFormValues(firingCycle));
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
              name="cycle"
              label={t("fieldCycle")}
              description={t("fieldCycleHelp")}
              inputMode="numeric"
              sanitize={digitsOnly}
              maxLength={3}
              disabled={isSubmitting}
            />
            <FormInput
              name="duration"
              label={t("fieldDuration")}
              description={t("fieldDurationHelp")}
              inputMode="numeric"
              sanitize={digitsOnly}
              maxLength={6}
              disabled={isSubmitting}
            />
            <FormInput
              name="temperature"
              label={t("fieldTemperature")}
              description={t("fieldTemperatureHelp")}
              inputMode="decimal"
              sanitize={decimalOnly}
              maxLength={8}
              disabled={isSubmitting}
            />
            <FormCurrencyInput
              name="price_per_unit"
              label={t("fieldPricePerUnit")}
              description={t("fieldPricePerUnitHelp")}
              maxLength={12}
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

function toFormValues(firingCycle?: FiringCycle): FiringCycleFormValues {
  return {
    cycle: firingCycle ? String(firingCycle.cycle) : "",
    duration: firingCycle ? String(firingCycle.duration) : "",
    name: firingCycle?.name ?? "",
    price_per_unit: maskedInputFromCents(firingCycle?.price_per_unit),
    temperature: firingCycle ? String(firingCycle.temperature) : "",
  };
}

function toPayload(values: FiringCycleFormValues): CreateFiringCyclePayload {
  return {
    cycle: Number(values.cycle),
    duration: Number(values.duration),
    name: values.name.trim(),
    price_per_unit: centsFromMaskedInput(values.price_per_unit),
    temperature: Number(values.temperature),
  };
}

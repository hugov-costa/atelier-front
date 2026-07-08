"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { useUpdateSettings } from "@/app/(dashboard)/settings/_hooks/useSettingsMutations";
import {
  createSettingsSchema,
  SettingsFormValues,
} from "@/app/(dashboard)/settings/_schemas/settingsSchema";
import { Form } from "@/components/form/form";
import {
  FormCurrencyInput,
  FormInput,
  FormSelect,
} from "@/components/form/form-fields";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Settings, UpdateSettingsPayload } from "@/interfaces/settings";
import { centsFromMaskedInput, maskedInputFromCents } from "@/utils/formatters";
import { decimalOnly } from "@/utils/inputSanitizers";

const DAY_OPTIONS = Array.from({ length: 28 }, (_, index) => String(index + 1));
const GRACE_OPTIONS = Array.from({ length: 32 }, (_, index) => String(index));

export function SettingsForm({ settings }: { settings: Settings }) {
  const t = useTranslations("settings");
  const common = useTranslations("common");
  const validation = useTranslations("validation");

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(createSettingsSchema(validation)),
    defaultValues: toFormValues(settings),
    reValidateMode: "onSubmit",
  });

  const updateMutation = useUpdateSettings({ setError: form.setError });
  const isSubmitting = updateMutation.isPending;

  const dayOptions = DAY_OPTIONS.map((value) => ({ label: value, value }));
  const graceOptions = GRACE_OPTIONS.map((value) => ({ label: value, value }));

  const onSubmit = (values: SettingsFormValues) => {
    updateMutation.mutate(toPayload(values));
  };

  return (
    <Form form={form} onSubmit={onSubmit}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("sectionCosts")}</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <FormCurrencyInput
                name="base_cost"
                label={t("fieldBaseCost")}
                description={t("fieldBaseCostHelp")}
                maxLength={12}
                disabled={isSubmitting}
              />
              <FormCurrencyInput
                name="tuition_monthly_cost"
                label={t("fieldTuitionMonthlyCost")}
                maxLength={12}
                disabled={isSubmitting}
              />
              <FormCurrencyInput
                name="annual_enrollment_cost"
                label={t("fieldAnnualEnrollmentCost")}
                maxLength={12}
                disabled={isSubmitting}
              />
              <FormInput
                name="default_profit_margin"
                label={t("fieldDefaultProfitMargin")}
                description={t("fieldDefaultProfitMarginHelp")}
                inputMode="decimal"
                sanitize={decimalOnly}
                maxLength={8}
                disabled={isSubmitting}
              />
              <FormInput
                name="clay_amount_multiplier"
                label={t("fieldClayAmountMultiplier")}
                description={t("fieldClayAmountMultiplierHelp")}
                inputMode="decimal"
                sanitize={decimalOnly}
                maxLength={8}
                disabled={isSubmitting}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">{t("sectionRules")}</CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <FormSelect
                name="tuition_fee_due_day_of_month"
                label={t("fieldTuitionDueDay")}
                description={t("fieldTuitionDueDayHelp")}
                options={dayOptions}
                disabled={isSubmitting}
              />
              <FormSelect
                name="piece_charge_billing_grace_days"
                label={t("fieldGraceDays")}
                description={t("fieldGraceDaysHelp")}
                options={graceOptions}
                disabled={isSubmitting}
              />
            </FieldGroup>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? common("saving") : common("save")}
          </Button>
        </div>
      </div>
    </Form>
  );
}

function toFormValues(settings: Settings): SettingsFormValues {
  return {
    annual_enrollment_cost: maskedInputFromCents(
      settings.annual_enrollment_cost,
    ),
    base_cost: maskedInputFromCents(settings.base_cost),
    clay_amount_multiplier: String(Number(settings.clay_amount_multiplier)),
    default_profit_margin: String(Number(settings.default_profit_margin)),
    piece_charge_billing_grace_days: String(
      settings.piece_charge_billing_grace_days,
    ),
    tuition_fee_due_day_of_month: String(settings.tuition_fee_due_day_of_month),
    tuition_monthly_cost: maskedInputFromCents(settings.tuition_monthly_cost),
  };
}

function toPayload(values: SettingsFormValues): UpdateSettingsPayload {
  return {
    annual_enrollment_cost: centsFromMaskedInput(values.annual_enrollment_cost),
    base_cost: centsFromMaskedInput(values.base_cost),
    clay_amount_multiplier: Number(values.clay_amount_multiplier),
    default_profit_margin: Number(values.default_profit_margin),
    piece_charge_billing_grace_days: Number(
      values.piece_charge_billing_grace_days,
    ),
    tuition_fee_due_day_of_month: Number(values.tuition_fee_due_day_of_month),
    tuition_monthly_cost: centsFromMaskedInput(values.tuition_monthly_cost),
  };
}

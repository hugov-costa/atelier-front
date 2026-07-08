"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";

import {
  useCreateEnrollment,
  useUpdateEnrollment,
} from "@/app/(dashboard)/enrollments/_hooks/useEnrollmentMutations";
import {
  EnrollmentFormValues,
  createEnrollmentSchema,
} from "@/app/(dashboard)/enrollments/_schemas/enrollmentSchema";
import { Form } from "@/components/form/form";
import {
  FormInput,
  FormSelect,
  FormSwitch,
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
  CreateEnrollmentPayload,
  Enrollment,
  UpdateEnrollmentPayload,
} from "@/interfaces/enrollment";
import { queryKeys } from "@/lib/queryKeys";
import { toStudentOptions } from "@/lib/userOptions";
import { listUsers } from "@/services/userService";

const OPTIONS_LIMIT = 100;

interface EnrollmentFormDialogProps {
  enrollment?: Enrollment;
  trigger: ReactNode;
}

export function EnrollmentFormDialog({
  enrollment,
  trigger,
}: EnrollmentFormDialogProps) {
  const t = useTranslations("enrollments");
  const common = useTranslations("common");
  const validation = useTranslations("validation");
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(enrollment);

  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(createEnrollmentSchema(validation)),
    defaultValues: toFormValues(enrollment),
    reValidateMode: "onSubmit",
  });

  const usersQuery = useQuery({
    queryKey: queryKeys.usersList({ page: 1, perPage: OPTIONS_LIMIT }),
    queryFn: () => listUsers({ page: 1, perPage: OPTIONS_LIMIT }),
    enabled: open,
  });

  const userOptions = toStudentOptions(usersQuery.data?.data);
  const studentName =
    (usersQuery.data?.data ?? []).find(
      (user) => user.id === enrollment?.user_id,
    )?.name ?? "—";

  const close = () => {
    setOpen(false);
    form.reset(toFormValues(enrollment));
  };

  const createMutation = useCreateEnrollment({
    setError: form.setError,
    onSuccess: close,
  });
  const updateMutation = useUpdateEnrollment({
    enrollmentId: enrollment?.id ?? "",
    setError: form.setError,
    onSuccess: close,
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: EnrollmentFormValues) => {
    if (enrollment) {
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
        form.reset(toFormValues(enrollment));
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
                <p className="text-muted-foreground">{t("studentReadonly")}</p>
                <p className="font-medium">{studentName}</p>
              </div>
            ) : (
              <FormSelect
                name="user_id"
                label={t("fieldStudent")}
                placeholder={t("fieldStudent")}
                options={userOptions}
                disabled={isSubmitting}
              />
            )}
            <FormInput
              name="annual_fee_due_date"
              label={t("fieldDueDate")}
              description={t("fieldDueDateHelp")}
              type="date"
              disabled={isSubmitting}
            />
            <FormSwitch name="annual_fee_is_paid" label={t("fieldIsPaid")} />
            <FormSwitch
              name="is_exempt_from_annual_fee"
              label={t("fieldExemptAnnualFee")}
              description={t("fieldExemptAnnualFeeHelp")}
            />
            <FormSwitch
              name="is_exempt_from_piece_charges"
              label={t("fieldExemptPieceCharges")}
            />
            <FormSwitch
              name="is_exempt_from_tuition_fee"
              label={t("fieldExemptTuitionFee")}
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
  values: EnrollmentFormValues,
): CreateEnrollmentPayload {
  return {
    annual_fee_due_date: values.annual_fee_due_date || null,
    annual_fee_is_paid: values.annual_fee_is_paid,
    is_exempt_from_annual_fee: values.is_exempt_from_annual_fee,
    is_exempt_from_piece_charges: values.is_exempt_from_piece_charges,
    is_exempt_from_tuition_fee: values.is_exempt_from_tuition_fee,
    user_id: values.user_id,
  };
}

function toFormValues(enrollment?: Enrollment): EnrollmentFormValues {
  return {
    annual_fee_due_date: enrollment?.annual_fee_due_date ?? "",
    annual_fee_is_paid: enrollment?.annual_fee_is_paid ?? false,
    is_exempt_from_annual_fee: enrollment?.is_exempt_from_annual_fee ?? false,
    is_exempt_from_piece_charges:
      enrollment?.is_exempt_from_piece_charges ?? false,
    is_exempt_from_tuition_fee: enrollment?.is_exempt_from_tuition_fee ?? false,
    user_id: enrollment?.user_id ?? "",
  };
}

function toUpdatePayload(
  values: EnrollmentFormValues,
): UpdateEnrollmentPayload {
  return {
    annual_fee_due_date: values.annual_fee_due_date || null,
    annual_fee_is_paid: values.annual_fee_is_paid,
    is_exempt_from_annual_fee: values.is_exempt_from_annual_fee,
    is_exempt_from_piece_charges: values.is_exempt_from_piece_charges,
    is_exempt_from_tuition_fee: values.is_exempt_from_tuition_fee,
  };
}

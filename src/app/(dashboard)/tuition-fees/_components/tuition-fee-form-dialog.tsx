"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ReactNode, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

import { useCreateTuitionFee } from "@/app/(dashboard)/tuition-fees/_hooks/useTuitionFeeMutations";
import {
  TuitionFeeFormValues,
  createTuitionFeeSchema,
} from "@/app/(dashboard)/tuition-fees/_schemas/tuitionFeeSchema";
import { Form } from "@/components/form/form";
import { FormSelect } from "@/components/form/form-fields";
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
import { queryKeys } from "@/lib/queryKeys";
import { listEnrollments } from "@/services/enrollmentService";
import { listUsers } from "@/services/userService";

const OPTIONS_LIMIT = 100;

interface TuitionFeeFormDialogProps {
  trigger: ReactNode;
}

const DEFAULT_VALUES: TuitionFeeFormValues = {
  enrollment_id: "",
};

export function TuitionFeeFormDialog({ trigger }: TuitionFeeFormDialogProps) {
  const t = useTranslations("tuitionFees");
  const common = useTranslations("common");
  const validation = useTranslations("validation");
  const [open, setOpen] = useState(false);

  const form = useForm<TuitionFeeFormValues>({
    resolver: zodResolver(createTuitionFeeSchema(validation)),
    defaultValues: DEFAULT_VALUES,
    reValidateMode: "onSubmit",
  });

  const enrollmentsQuery = useQuery({
    queryKey: queryKeys.enrollmentsList({ page: 1, perPage: OPTIONS_LIMIT }),
    queryFn: () => listEnrollments({ page: 1, perPage: OPTIONS_LIMIT }),
    enabled: open,
  });
  const usersQuery = useQuery({
    queryKey: queryKeys.usersList({ page: 1, perPage: OPTIONS_LIMIT }),
    queryFn: () => listUsers({ page: 1, perPage: OPTIONS_LIMIT }),
    enabled: open,
  });

  const userNames = useMemo(
    () =>
      new Map(
        (usersQuery.data?.data ?? []).map((user) => [user.id, user.name]),
      ),
    [usersQuery.data],
  );

  const enrollmentOptions = (enrollmentsQuery.data?.data ?? []).map(
    (enrollment) => ({
      label: userNames.get(enrollment.user_id) ?? "—",
      value: enrollment.id,
    }),
  );

  const close = () => {
    setOpen(false);
    form.reset(DEFAULT_VALUES);
  };

  const createMutation = useCreateTuitionFee({
    setError: form.setError,
    onSuccess: close,
  });

  const isSubmitting = createMutation.isPending;

  const onSubmit = (values: TuitionFeeFormValues) => {
    createMutation.mutate({ enrollment_id: values.enrollment_id });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        form.reset(DEFAULT_VALUES);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        className="max-h-[90vh] overflow-y-auto"
        onOpenAutoFocus={(event) => event.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{t("createTitle")}</DialogTitle>
          <DialogDescription>{t("createDescription")}</DialogDescription>
        </DialogHeader>
        <Form form={form} onSubmit={onSubmit}>
          <FieldGroup>
            <FormSelect
              name="enrollment_id"
              label={t("fieldEnrollment")}
              description={t("fieldEnrollmentHelp")}
              placeholder={t("fieldEnrollment")}
              options={enrollmentOptions}
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

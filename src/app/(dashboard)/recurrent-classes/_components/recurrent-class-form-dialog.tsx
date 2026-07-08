"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";

import {
  useCreateRecurrentClass,
  useUpdateRecurrentClass,
} from "@/app/(dashboard)/recurrent-classes/_hooks/useRecurrentClassMutations";
import {
  RecurrentClassFormValues,
  createRecurrentClassSchema,
} from "@/app/(dashboard)/recurrent-classes/_schemas/recurrentClassSchema";
import { Form } from "@/components/form/form";
import {
  FormInput,
  FormMultiSelect,
  FormSelect,
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
  CreateRecurrentClassPayload,
  RecurrentClass,
  UpdateRecurrentClassPayload,
} from "@/interfaces/recurrentClass";
import { DayOfWeek, daysOfWeek } from "@/lib/enums";
import { queryKeys } from "@/lib/queryKeys";
import { toStudentOptions } from "@/lib/userOptions";
import { listUsers } from "@/services/userService";
import { timeInputFromApi, timeInputToApi } from "@/utils/formatters";

const OPTIONS_LIMIT = 100;

interface RecurrentClassFormDialogProps {
  recurrentClass?: RecurrentClass;
  trigger: ReactNode;
}

export function RecurrentClassFormDialog({
  recurrentClass,
  trigger,
}: RecurrentClassFormDialogProps) {
  const t = useTranslations("recurrentClasses");
  const common = useTranslations("common");
  const enumsT = useTranslations("enums");
  const validation = useTranslations("validation");
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(recurrentClass);

  const form = useForm<RecurrentClassFormValues>({
    resolver: zodResolver(createRecurrentClassSchema(validation)),
    defaultValues: toFormValues(recurrentClass),
    reValidateMode: "onSubmit",
  });

  const usersQuery = useQuery({
    queryKey: queryKeys.usersList({ page: 1, perPage: OPTIONS_LIMIT }),
    queryFn: () => listUsers({ page: 1, perPage: OPTIONS_LIMIT }),
    enabled: open,
  });

  const userOptions = toStudentOptions(usersQuery.data?.data);

  const dayOptions = daysOfWeek.map((day) => ({
    label: enumsT(`dayOfWeek.${day}`),
    value: String(day),
  }));

  const close = () => {
    setOpen(false);
    form.reset(toFormValues(recurrentClass));
  };

  const createMutation = useCreateRecurrentClass({
    setError: form.setError,
    onSuccess: close,
  });
  const updateMutation = useUpdateRecurrentClass({
    recurrentClassId: recurrentClass?.id ?? "",
    setError: form.setError,
    onSuccess: close,
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: RecurrentClassFormValues) => {
    if (recurrentClass) {
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
        form.reset(toFormValues(recurrentClass));
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
            <FormSelect
              name="day_of_the_week"
              label={t("fieldDay")}
              placeholder={t("fieldDay")}
              options={dayOptions}
              disabled={isSubmitting}
            />
            <FormInput
              name="start_time"
              label={t("fieldStart")}
              type="time"
              disabled={isSubmitting}
            />
            <FormInput
              name="end_time"
              label={t("fieldEnd")}
              type="time"
              disabled={isSubmitting}
            />
            <FormMultiSelect
              name="user_ids"
              label={t("fieldStudents")}
              options={userOptions}
              emptyMessage={t("fieldStudentsEmpty")}
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
  values: RecurrentClassFormValues,
): CreateRecurrentClassPayload {
  return {
    day_of_the_week: Number(values.day_of_the_week) as DayOfWeek,
    end_time: timeInputToApi(values.end_time),
    start_time: timeInputToApi(values.start_time),
    user_ids: values.user_ids,
  };
}

function toFormValues(
  recurrentClass?: RecurrentClass,
): RecurrentClassFormValues {
  return {
    day_of_the_week: recurrentClass
      ? String(recurrentClass.day_of_the_week)
      : "",
    end_time: timeInputFromApi(recurrentClass?.end_time),
    start_time: timeInputFromApi(recurrentClass?.start_time),
    user_ids: recurrentClass?.users?.map((user) => user.id) ?? [],
  };
}

function toUpdatePayload(
  values: RecurrentClassFormValues,
): UpdateRecurrentClassPayload {
  return {
    day_of_the_week: Number(values.day_of_the_week) as DayOfWeek,
    end_time: timeInputToApi(values.end_time),
    start_time: timeInputToApi(values.start_time),
    user_ids: values.user_ids,
  };
}

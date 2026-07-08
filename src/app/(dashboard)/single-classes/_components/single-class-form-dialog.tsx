"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";

import {
  useCreateSingleClass,
  useUpdateSingleClass,
} from "@/app/(dashboard)/single-classes/_hooks/useSingleClassMutations";
import {
  SingleClassFormValues,
  createSingleClassSchema,
} from "@/app/(dashboard)/single-classes/_schemas/singleClassSchema";
import { Form } from "@/components/form/form";
import {
  FormCurrencyInput,
  FormInput,
  FormMultiSelect,
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
  CreateSingleClassPayload,
  SingleClass,
  UpdateSingleClassPayload,
} from "@/interfaces/singleClass";
import { queryKeys } from "@/lib/queryKeys";
import { toStudentOptions } from "@/lib/userOptions";
import { listUsers } from "@/services/userService";
import {
  centsFromMaskedInput,
  datetimeInputFromApi,
  datetimeInputToApi,
  maskedInputFromCents,
} from "@/utils/formatters";

const OPTIONS_LIMIT = 100;

interface SingleClassFormDialogProps {
  singleClass?: SingleClass;
  trigger: ReactNode;
}

export function SingleClassFormDialog({
  singleClass,
  trigger,
}: SingleClassFormDialogProps) {
  const t = useTranslations("singleClasses");
  const common = useTranslations("common");
  const validation = useTranslations("validation");
  const [open, setOpen] = useState(false);
  const isEdit = Boolean(singleClass);

  const form = useForm<SingleClassFormValues>({
    resolver: zodResolver(createSingleClassSchema(validation)),
    defaultValues: toFormValues(singleClass),
    reValidateMode: "onSubmit",
  });

  const usersQuery = useQuery({
    queryKey: queryKeys.usersList({ page: 1, perPage: OPTIONS_LIMIT }),
    queryFn: () => listUsers({ page: 1, perPage: OPTIONS_LIMIT }),
    enabled: open,
  });

  const userOptions = toStudentOptions(usersQuery.data?.data);

  const close = () => {
    setOpen(false);
    form.reset(toFormValues(singleClass));
  };

  const createMutation = useCreateSingleClass({
    setError: form.setError,
    onSuccess: close,
  });
  const updateMutation = useUpdateSingleClass({
    singleClassId: singleClass?.id ?? "",
    setError: form.setError,
    onSuccess: close,
  });

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const onSubmit = (values: SingleClassFormValues) => {
    if (singleClass) {
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
        form.reset(toFormValues(singleClass));
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
              name="start_datetime"
              label={t("fieldStart")}
              type="datetime-local"
              disabled={isSubmitting}
            />
            <FormInput
              name="end_datetime"
              label={t("fieldEnd")}
              type="datetime-local"
              disabled={isSubmitting}
            />
            <FormCurrencyInput
              name="price"
              label={t("fieldPrice")}
              description={t("fieldPriceHelp")}
              maxLength={12}
              disabled={isSubmitting}
            />
            <FormMultiSelect
              name="user_ids"
              label={t("fieldStudents")}
              options={userOptions}
              emptyMessage={t("fieldStudentsEmpty")}
            />
            <FormSwitch
              name="is_replacement"
              label={t("fieldReplacement")}
              description={t("fieldReplacementHelp")}
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
  values: SingleClassFormValues,
): CreateSingleClassPayload {
  return {
    end_datetime: datetimeInputToApi(values.end_datetime),
    is_replacement: values.is_replacement,
    price: values.price ? centsFromMaskedInput(values.price) : null,
    start_datetime: datetimeInputToApi(values.start_datetime),
    user_ids: values.user_ids,
  };
}

function toFormValues(singleClass?: SingleClass): SingleClassFormValues {
  return {
    end_datetime: datetimeInputFromApi(singleClass?.end_datetime),
    is_replacement: singleClass?.is_replacement ?? false,
    price: maskedInputFromCents(singleClass?.price),
    start_datetime: datetimeInputFromApi(singleClass?.start_datetime),
    user_ids: singleClass?.users?.map((user) => user.id) ?? [],
  };
}

function toUpdatePayload(
  values: SingleClassFormValues,
): UpdateSingleClassPayload {
  return {
    end_datetime: datetimeInputToApi(values.end_datetime),
    is_replacement: values.is_replacement,
    price: values.price ? centsFromMaskedInput(values.price) : null,
    start_datetime: datetimeInputToApi(values.start_datetime),
    user_ids: values.user_ids,
  };
}

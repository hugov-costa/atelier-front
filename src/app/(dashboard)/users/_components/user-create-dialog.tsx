"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useCreateUserMutation } from "@/app/(dashboard)/users/_hooks/useCreateUserMutation";
import {
  createUserSchema,
  UserFormValues,
} from "@/app/(dashboard)/users/_schemas/userSchema";
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
import { useAuthorization } from "@/hooks/useAuthorization";
import { UserRole } from "@/interfaces/user";
import { CreateUserPayload } from "@/interfaces/userResponse";
import { digitsOnly } from "@/utils/inputSanitizers";

const DEFAULT_VALUES: UserFormValues = {
  admission_date: "",
  birthday: "",
  email: "",
  is_active: true,
  name: "",
  phone: "",
  role: "user",
};

export function UserCreateDialog() {
  const t = useTranslations("users");
  const common = useTranslations("common");
  const validation = useTranslations("validation");
  const { isMaster } = useAuthorization();
  const [open, setOpen] = useState(false);

  const form = useForm<UserFormValues>({
    resolver: zodResolver(createUserSchema(validation)),
    defaultValues: DEFAULT_VALUES,
    reValidateMode: "onSubmit",
  });

  const close = () => {
    setOpen(false);
    form.reset(DEFAULT_VALUES);
  };

  const createMutation = useCreateUserMutation({
    setError: form.setError,
    onCreated: close,
  });

  const isSubmitting = createMutation.isPending;

  const roleOptions: { label: string; value: UserRole }[] = [
    { label: t("roleUser"), value: "user" },
    { label: t("roleAdmin"), value: "admin" },
    { label: t("roleMaster"), value: "master" },
  ];

  const onSubmit = (values: UserFormValues) => {
    createMutation.mutate(toPayload(values, isMaster));
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        form.reset(DEFAULT_VALUES);
      }}
    >
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          {t("new")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("newTitle")}</DialogTitle>
          <DialogDescription>{t("newDescription")}</DialogDescription>
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
              label={t("fieldEmail")}
              type="email"
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
            <FormInput
              name="birthday"
              label={t("fieldBirthday")}
              type="date"
              disabled={isSubmitting}
            />
            <FormInput
              name="admission_date"
              label={t("fieldAdmissionDate")}
              description={t("fieldAdmissionDateHelp")}
              type="date"
              disabled={isSubmitting}
            />
            {isMaster ? (
              <FormSelect
                name="role"
                label={t("fieldRole")}
                description={t("fieldRoleHelp")}
                options={roleOptions}
                disabled={isSubmitting}
              />
            ) : null}
            <FormSwitch
              name="is_active"
              label={t("fieldActive")}
              description={t("fieldActiveHelp")}
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

function toPayload(
  values: UserFormValues,
  isMaster: boolean,
): CreateUserPayload {
  const payload: CreateUserPayload = {
    admission_date: values.admission_date || null,
    birthday: values.birthday || null,
    email: values.email.trim(),
    is_active: values.is_active,
    name: values.name.trim(),
    phone: values.phone.trim() || null,
  };

  if (isMaster) {
    payload.role = values.role as UserRole;
  }

  return payload;
}

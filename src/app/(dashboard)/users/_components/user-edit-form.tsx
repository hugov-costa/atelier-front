"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { useUpdateUserMutation } from "@/app/(dashboard)/users/_hooks/useUpdateUserMutation";
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
import { FieldGroup } from "@/components/ui/field";
import { useAuthorization } from "@/hooks/useAuthorization";
import { User, UserRole } from "@/interfaces/user";
import { UpdateUserPayload } from "@/interfaces/userResponse";
import { digitsOnly } from "@/utils/inputSanitizers";

export function UserEditForm({ user }: { user: User }) {
  const t = useTranslations("users");
  const common = useTranslations("common");
  const validation = useTranslations("validation");
  const router = useRouter();
  const { isMaster } = useAuthorization();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(createUserSchema(validation)),
    defaultValues: toFormValues(user),
    reValidateMode: "onSubmit",
  });

  const updateUserMutation = useUpdateUserMutation({
    userId: user.id,
    setError: form.setError,
    onUpdated: () => {
      router.push("/users");
    },
  });

  const isSubmitting = updateUserMutation.isPending;

  const roleOptions: { label: string; value: UserRole }[] = [
    { label: t("roleUser"), value: "user" },
    { label: t("roleAdmin"), value: "admin" },
    { label: t("roleMaster"), value: "master" },
  ];

  return (
    <Form
      form={form}
      onSubmit={(values) =>
        updateUserMutation.mutate(toPayload(values, isMaster))
      }
      className="max-w-md"
    >
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
        {isMaster ? (
          <>
            <FormInput
              name="admission_date"
              label={t("fieldAdmissionDate")}
              description={t("fieldAdmissionDateHelp")}
              type="date"
              disabled={isSubmitting}
            />
            <FormSelect
              name="role"
              label={t("fieldRole")}
              description={t("fieldRoleHelp")}
              options={roleOptions}
              disabled={isSubmitting}
            />
            <FormSwitch
              name="is_active"
              label={t("fieldActive")}
              description={t("fieldActiveHelp")}
            />
          </>
        ) : null}
        <div className="flex gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? common("saving") : common("save")}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isSubmitting}
            onClick={() => router.push("/users")}
          >
            {common("cancel")}
          </Button>
        </div>
      </FieldGroup>
    </Form>
  );
}

function toFormValues(user: User): UserFormValues {
  return {
    admission_date: user.admission_date ?? "",
    birthday: user.birthday ?? "",
    email: user.email,
    is_active: user.is_active ?? true,
    name: user.name,
    phone: user.phone ?? "",
    role: user.role ?? "user",
  };
}

function toPayload(
  values: UserFormValues,
  isMaster: boolean,
): UpdateUserPayload {
  const payload: UpdateUserPayload = {
    birthday: values.birthday || null,
    email: values.email.trim(),
    name: values.name.trim(),
    phone: values.phone.trim() || null,
  };

  if (isMaster) {
    payload.admission_date = values.admission_date || null;
    payload.is_active = values.is_active;
    payload.role = values.role as UserRole;
  }

  return payload;
}

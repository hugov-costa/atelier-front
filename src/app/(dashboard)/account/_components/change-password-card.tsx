"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { useChangePassword } from "@/app/(dashboard)/account/_hooks/useChangePassword";
import {
  ChangePasswordFormValues,
  createChangePasswordSchema,
} from "@/app/(dashboard)/account/_schemas/changePasswordSchema";
import { Form } from "@/components/form/form";
import { FormInput } from "@/components/form/form-fields";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

export function ChangePasswordCard() {
  const t = useTranslations("account");
  const validation = useTranslations("validation");

  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(createChangePasswordSchema(validation)),
    defaultValues: {
      currentPassword: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const changePasswordMutation = useChangePassword({
    setError: form.setError,
    onChanged: () => form.reset(),
  });

  const isSubmitting = changePasswordMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("passwordTitle")}</CardTitle>
        <CardDescription>{t("passwordDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form
          form={form}
          onSubmit={(values) => changePasswordMutation.mutate(values)}
        >
          <FieldGroup>
            <FormInput
              name="currentPassword"
              label={t("passwordCurrent")}
              type="password"
              autoComplete="current-password"
              disabled={isSubmitting}
            />
            <FormInput
              name="password"
              label={t("passwordNew")}
              type="password"
              autoComplete="new-password"
              disabled={isSubmitting}
            />
            <FormInput
              name="passwordConfirmation"
              label={t("passwordConfirm")}
              type="password"
              autoComplete="new-password"
              disabled={isSubmitting}
            />
            <Button type="submit" className="w-fit" disabled={isSubmitting}>
              {isSubmitting ? t("passwordSubmitting") : t("passwordSubmit")}
            </Button>
          </FieldGroup>
        </Form>
      </CardContent>
    </Card>
  );
}

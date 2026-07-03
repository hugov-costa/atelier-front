"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { useUpdateProfile } from "@/app/(dashboard)/account/_hooks/useUpdateProfile";
import {
  createProfileSchema,
  ProfileFormValues,
} from "@/app/(dashboard)/account/_schemas/profileSchema";
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
import { User } from "@/interfaces/user";
import { UpdateUserPayload } from "@/interfaces/userResponse";

export function ProfileCard({ user }: { user: User }) {
  const t = useTranslations("account");
  const validation = useTranslations("validation");

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(createProfileSchema(validation)),
    defaultValues: {
      name: user.name,
      email: user.email,
      currentPassword: "",
    },
  });

  const updateProfileMutation = useUpdateProfile({
    userId: user.id,
    setError: form.setError,
  });

  const onSubmit = (values: ProfileFormValues) => {
    const isEmailChanged = values.email !== user.email;

    if (isEmailChanged && values.currentPassword.length === 0) {
      form.setError("currentPassword", {
        type: "manual",
        message: validation("currentPasswordForEmail"),
      });
      return;
    }

    const payload: UpdateUserPayload = {
      name: values.name,
      email: values.email,
    };

    if (isEmailChanged) {
      payload.current_password = values.currentPassword;
    }

    updateProfileMutation.mutate(payload);
  };

  const isSubmitting = updateProfileMutation.isPending;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("profileTitle")}</CardTitle>
        <CardDescription>{t("profileDescription")}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form form={form} onSubmit={onSubmit}>
          <FieldGroup>
            <FormInput
              name="name"
              label={t("profileName")}
              autoComplete="name"
              disabled={isSubmitting}
            />
            <FormInput
              name="email"
              label={t("profileEmail")}
              type="email"
              autoComplete="email"
              disabled={isSubmitting}
            />
            <FormInput
              name="currentPassword"
              label={t("profileCurrentPassword")}
              type="password"
              autoComplete="current-password"
              disabled={isSubmitting}
            />
            <Button type="submit" className="w-fit" disabled={isSubmitting}>
              {isSubmitting ? t("passwordSubmitting") : t("profileSubmit")}
            </Button>
          </FieldGroup>
        </Form>
      </CardContent>
    </Card>
  );
}

"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { useResetPassword } from "@/app/reset-password/_hooks/useResetPassword";
import {
  createResetPasswordSchema,
  ResetPasswordFormValues,
} from "@/app/reset-password/_schemas/resetPasswordSchema";
import { Form } from "@/components/form/form";
import { FormInput } from "@/components/form/form-fields";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

export function ResetPasswordForm() {
  const t = useTranslations("auth.resetPassword");
  const validation = useTranslations("validation");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(createResetPasswordSchema(validation)),
    defaultValues: { password: "", passwordConfirmation: "" },
  });

  const resetPasswordMutation = useResetPassword({
    token,
    email,
    setError: form.setError,
  });

  const hasValidLink = token.length > 0 && email.length > 0;
  const isSubmitting = resetPasswordMutation.isPending;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          {email ? t("descriptionFor", { email }) : t("description")}
        </CardDescription>
      </CardHeader>
      {hasValidLink ? (
        <Form
          form={form}
          onSubmit={(values) => resetPasswordMutation.mutate(values)}
        >
          <CardContent>
            <FieldGroup>
              <FormInput
                name="password"
                label={t("newPassword")}
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                disabled={isSubmitting}
              />
              <FormInput
                name="passwordConfirmation"
                label={t("confirm")}
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                disabled={isSubmitting}
              />
            </FieldGroup>
          </CardContent>
          <CardFooter className="mt-6">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t("submitting") : t("submit")}
            </Button>
          </CardFooter>
        </Form>
      ) : (
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm">{t("invalidLink")}</p>
          <Button asChild variant="outline">
            <Link href="/forgot-password">{t("requestNew")}</Link>
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

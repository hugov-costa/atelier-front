"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";

import { useSetPassword } from "@/app/set-password/_hooks/useSetPassword";
import {
  createSetPasswordSchema,
  SetPasswordFormValues,
} from "@/app/set-password/_schemas/setPasswordSchema";
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
import { validateSetPasswordToken } from "@/services/authService";

export function SetPasswordForm() {
  const t = useTranslations("auth.setPassword");
  const validation = useTranslations("validation");
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const form = useForm<SetPasswordFormValues>({
    resolver: zodResolver(createSetPasswordSchema(validation)),
    defaultValues: { password: "", passwordConfirmation: "" },
  });

  const setPasswordMutation = useSetPassword({
    token,
    email,
    setError: form.setError,
  });

  const hasValidLink = token.length > 0 && email.length > 0;
  const isSubmitting = setPasswordMutation.isPending;

  const tokenValidation = useQuery({
    queryKey: ["set-password", "validate", email, token],
    queryFn: () => validateSetPasswordToken({ email, token }),
    enabled: hasValidLink,
    retry: false,
  });

  const invalidLinkFallback = (
    <CardContent className="space-y-4">
      <p className="text-muted-foreground text-sm">{t("invalidLink")}</p>
      <Button asChild variant="outline">
        <Link href="/forgot-password">{t("requestNew")}</Link>
      </Button>
    </CardContent>
  );

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
        <CardDescription>
          {email ? t("descriptionFor", { email }) : t("description")}
        </CardDescription>
      </CardHeader>
      {hasValidLink ? (
        tokenValidation.isPending ? (
          <CardContent>
            <p className="text-muted-foreground text-sm">{t("validating")}</p>
          </CardContent>
        ) : tokenValidation.isError ? (
          invalidLinkFallback
        ) : (
          <Form
            form={form}
            onSubmit={(values) => setPasswordMutation.mutate(values)}
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
        )
      ) : (
        invalidLinkFallback
      )}
    </Card>
  );
}

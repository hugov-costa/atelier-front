"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { useForgotPassword } from "@/app/forgot-password/_hooks/useForgotPassword";
import {
  createForgotPasswordSchema,
  ForgotPasswordFormValues,
} from "@/app/forgot-password/_schemas/forgotPasswordSchema";
import { AuthLocaleControl } from "@/components/auth-locale-control";
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

export default function ForgotPasswordPage() {
  const t = useTranslations("auth.forgotPassword");
  const validation = useTranslations("validation");
  const [isSent, setIsSent] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(createForgotPasswordSchema(validation)),
    defaultValues: { email: "" },
  });

  const forgotPasswordMutation = useForgotPassword({
    setError: form.setError,
    onSent: () => setIsSent(true),
  });

  const isSubmitting = forgotPasswordMutation.isPending;

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <AuthLocaleControl />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        {isSent ? (
          <CardContent>
            <p className="text-muted-foreground text-sm">{t("sent")}</p>
          </CardContent>
        ) : (
          <Form
            form={form}
            onSubmit={(values) => forgotPasswordMutation.mutate(values)}
          >
            <CardContent>
              <FieldGroup>
                <FormInput
                  name="email"
                  label={t("email")}
                  type="email"
                  autoComplete="email"
                  placeholder="voce@exemplo.com"
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
        )}
      </Card>
    </main>
  );
}

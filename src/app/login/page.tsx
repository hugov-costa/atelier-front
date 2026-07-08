"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useLogin } from "@/app/login/_hooks/useLogin";
import { useLoginForm } from "@/app/login/_hooks/useLoginForm";
import { AuthLocaleControl } from "@/components/auth-locale-control";
import { Form } from "@/components/form/form";
import { FormInput } from "@/components/form/form-fields";
import { Button } from "@/components/ui/button";
import { FieldGroup } from "@/components/ui/field";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const form = useLoginForm();
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const loginMutation = useLogin({
    setError: form.setError,
    onTwoFactorRequired: () => setRequiresTwoFactor(true),
  });

  const isSubmitting = loginMutation.isPending;

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <AuthLocaleControl />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <Form form={form} onSubmit={(values) => loginMutation.mutate(values)}>
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
              <FormInput
                name="password"
                label={t("password")}
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                disabled={isSubmitting}
              />
              {requiresTwoFactor ? (
                <FormInput
                  name="code"
                  label={t("code")}
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="000000"
                  disabled={isSubmitting}
                />
              ) : null}
            </FieldGroup>
          </CardContent>
          <CardFooter className="mt-6 flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t("submitting") : t("submit")}
            </Button>
            <Link
              href="/forgot-password"
              className="text-muted-foreground hover:text-foreground text-sm"
            >
              {t("forgotPassword")}
            </Link>
          </CardFooter>
        </Form>
      </Card>
    </main>
  );
}

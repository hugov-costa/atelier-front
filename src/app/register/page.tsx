"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";

import { useRegister } from "@/app/register/_hooks/useRegister";
import { useRegisterForm } from "@/app/register/_hooks/useRegisterForm";
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

export default function RegisterPage() {
  const t = useTranslations("auth.register");
  const form = useRegisterForm();
  const registerMutation = useRegister(form.setError);
  const isSubmitting = registerMutation.isPending;

  return (
    <main className="flex flex-1 items-center justify-center p-6">
      <AuthLocaleControl />
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
          <CardDescription>{t("description")}</CardDescription>
        </CardHeader>
        <Form
          form={form}
          onSubmit={(values) => registerMutation.mutate(values)}
        >
          <CardContent>
            <FieldGroup>
              <FormInput
                name="name"
                label={t("name")}
                autoComplete="name"
                placeholder={t("namePlaceholder")}
                disabled={isSubmitting}
              />
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
                autoComplete="new-password"
                placeholder="••••••••"
                disabled={isSubmitting}
              />
              <FormInput
                name="passwordConfirmation"
                label={t("passwordConfirmation")}
                type="password"
                autoComplete="new-password"
                placeholder="••••••••"
                disabled={isSubmitting}
              />
            </FieldGroup>
          </CardContent>
          <CardFooter className="mt-6 flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? t("submitting") : t("submit")}
            </Button>
            <p className="text-muted-foreground text-sm">
              {t("hasAccount")}{" "}
              <Link href="/login" className="text-foreground underline">
                {t("login")}
              </Link>
            </p>
          </CardFooter>
        </Form>
      </Card>
    </main>
  );
}

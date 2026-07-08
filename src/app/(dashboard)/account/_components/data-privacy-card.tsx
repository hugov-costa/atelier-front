"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";

import { useDeleteAccount } from "@/app/(dashboard)/account/_hooks/useDeleteAccount";
import { useExportAccountData } from "@/app/(dashboard)/account/_hooks/useExportAccountData";
import {
  DeleteAccountFormValues,
  createDeleteAccountSchema,
} from "@/app/(dashboard)/account/_schemas/deleteAccountSchema";
import { ConfirmDialog } from "@/components/confirm-dialog";
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

export function DataPrivacyCard() {
  const t = useTranslations("account");
  const validation = useTranslations("validation");

  const exportMutation = useExportAccountData();

  const form = useForm<DeleteAccountFormValues>({
    resolver: zodResolver(createDeleteAccountSchema(validation)),
    defaultValues: { password: "" },
  });

  const deleteMutation = useDeleteAccount({ setError: form.setError });

  const password = useWatch({ control: form.control, name: "password" });

  const isDeleting = deleteMutation.isPending;
  const isExporting = exportMutation.isPending;
  const canConfirmDeletion = password.trim().length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("privacyTitle")}</CardTitle>
        <CardDescription>{t("privacyDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            {t("exportDescription")}
          </p>
          <Button
            type="button"
            variant="outline"
            className="w-fit"
            disabled={isExporting}
            onClick={() => exportMutation.mutate()}
          >
            {isExporting ? t("exportSubmitting") : t("exportSubmit")}
          </Button>
        </div>

        <div className="space-y-3 rounded-lg border border-destructive/30 p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium text-destructive">
              {t("deleteTitle")}
            </p>
            <p className="text-sm text-muted-foreground">
              {t("deleteDescription")}
            </p>
          </div>
          <Form
            form={form}
            onSubmit={(values) => deleteMutation.mutate(values)}
          >
            <FieldGroup>
              <FormInput
                name="password"
                label={t("deletePasswordLabel")}
                type="password"
                autoComplete="current-password"
                disabled={isDeleting}
              />
              <ConfirmDialog
                trigger={
                  <Button
                    type="button"
                    variant="destructive"
                    className="w-fit"
                    disabled={isDeleting || !canConfirmDeletion}
                  >
                    {isDeleting ? t("deleteSubmitting") : t("deleteSubmit")}
                  </Button>
                }
                title={t("deleteConfirmTitle")}
                description={t("deleteConfirmDescription")}
                confirmLabel={t("deleteConfirmAction")}
                cancelLabel={t("deleteConfirmCancel")}
                isConfirming={isDeleting}
                onConfirm={() =>
                  form.handleSubmit((values) => deleteMutation.mutate(values))()
                }
              />
            </FieldGroup>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
}

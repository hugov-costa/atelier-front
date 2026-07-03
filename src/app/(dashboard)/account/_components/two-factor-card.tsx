"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import { useTwoFactor } from "@/app/(dashboard)/account/_hooks/useTwoFactor";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type PendingAction = "disable" | "regenerate" | null;

export function TwoFactorCard() {
  const t = useTranslations("account");
  const common = useTranslations("common");
  const [code, setCode] = useState("");
  const [pendingAction, setPendingAction] = useState<PendingAction>(null);
  const [confirmPassword, setConfirmPassword] = useState("");
  const {
    stage,
    setup,
    codeError,
    recoveryCodes,
    confirmError,
    setConfirmError,
    enableMutation,
    confirmMutation,
    disableMutation,
    regenerateMutation,
  } = useTwoFactor();

  const isBusy =
    enableMutation.isPending ||
    confirmMutation.isPending ||
    disableMutation.isPending ||
    regenerateMutation.isPending;

  function startAction(action: PendingAction) {
    setConfirmError(null);
    setConfirmPassword("");
    setPendingAction(action);
  }

  function cancelAction() {
    setPendingAction(null);
    setConfirmPassword("");
    setConfirmError(null);
  }

  function submitAction() {
    const mutation =
      pendingAction === "disable" ? disableMutation : regenerateMutation;

    mutation.mutate(confirmPassword, {
      onSuccess: () => {
        setPendingAction(null);
        setConfirmPassword("");
      },
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("twoFactorTitle")}</CardTitle>
        <CardDescription>{t("twoFactorDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {stage === "idle" ? (
          <Button
            type="button"
            disabled={isBusy}
            onClick={() => enableMutation.mutate()}
          >
            {enableMutation.isPending
              ? t("twoFactorGenerating")
              : t("twoFactorConfigure")}
          </Button>
        ) : null}

        {stage === "provisioning" && setup ? (
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">{t("twoFactorStep1")}</p>
              <code className="bg-muted block rounded px-2 py-1 text-sm break-all">
                {setup.secret}
              </code>
              <p className="text-muted-foreground text-xs break-all">
                {t("twoFactorProvisioningUrl", { url: setup.qr_code_url })}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">{t("twoFactorStep2")}</p>
              <ul className="bg-muted grid grid-cols-2 gap-1 rounded p-2 text-sm">
                {setup.recovery_codes.map((recoveryCode) => (
                  <li key={recoveryCode}>
                    <code>{recoveryCode}</code>
                  </li>
                ))}
              </ul>
            </div>

            <Field data-invalid={Boolean(codeError)}>
              <FieldLabel htmlFor="twoFactorCode">
                {t("twoFactorStep3")}
              </FieldLabel>
              <Input
                id="twoFactorCode"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="000000"
                value={code}
                aria-invalid={Boolean(codeError)}
                onChange={(event) => setCode(event.target.value)}
              />
              <FieldError
                errors={codeError ? [{ message: codeError }] : undefined}
              />
            </Field>

            <Button
              type="button"
              disabled={isBusy || code.length === 0}
              onClick={() => confirmMutation.mutate(code)}
            >
              {confirmMutation.isPending
                ? t("twoFactorConfirming")
                : t("twoFactorConfirm")}
            </Button>
          </div>
        ) : null}

        {stage === "confirmed" ? (
          <div className="space-y-4">
            <p className="text-sm">{t("twoFactorActive")}</p>

            {recoveryCodes ? (
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {t("twoFactorRecoveryCodesTitle")}
                </p>
                <ul className="bg-muted grid grid-cols-2 gap-1 rounded p-2 text-sm">
                  {recoveryCodes.map((recoveryCode) => (
                    <li key={recoveryCode}>
                      <code>{recoveryCode}</code>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {pendingAction ? (
              <div className="border-border space-y-3 border-t pt-4">
                <Field data-invalid={Boolean(confirmError)}>
                  <FieldLabel htmlFor="twoFactorConfirmPassword">
                    {t("twoFactorConfirmPasswordLabel")}
                  </FieldLabel>
                  <Input
                    id="twoFactorConfirmPassword"
                    type="password"
                    autoComplete="current-password"
                    value={confirmPassword}
                    aria-invalid={Boolean(confirmError)}
                    aria-describedby={
                      confirmError
                        ? "twoFactorConfirmPassword-error"
                        : undefined
                    }
                    onChange={(event) => setConfirmPassword(event.target.value)}
                  />
                  <FieldError
                    id="twoFactorConfirmPassword-error"
                    errors={
                      confirmError ? [{ message: confirmError }] : undefined
                    }
                  />
                </Field>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    disabled={isBusy || confirmPassword.length === 0}
                    onClick={submitAction}
                  >
                    {isBusy
                      ? t("twoFactorConfirming")
                      : t("twoFactorConfirmPasswordSubmit")}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={isBusy}
                    onClick={cancelAction}
                  >
                    {common("cancel")}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="border-border flex flex-wrap gap-2 border-t pt-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isBusy}
                  onClick={() => startAction("regenerate")}
                >
                  {t("twoFactorRegenerate")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isBusy}
                  onClick={() => startAction("disable")}
                >
                  {t("twoFactorDisable")}
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

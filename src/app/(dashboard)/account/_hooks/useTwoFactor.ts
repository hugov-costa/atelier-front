"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

import { useUser } from "@/contexts/user-context";
import { TwoFactorSetup } from "@/interfaces/twoFactor";
import { queryKeys } from "@/lib/queryKeys";
import {
  confirmTwoFactor,
  disableTwoFactor,
  enableTwoFactor,
  regenerateRecoveryCodes,
} from "@/services/twoFactorService";
import { isFormValidationHttpError } from "@/utils/formValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

type TwoFactorStage = "idle" | "provisioning" | "confirmed";

export function useTwoFactor() {
  const t = useTranslations("toasts");
  const { user, setUser } = useUser();
  const queryClient = useQueryClient();
  const isEnabled = Boolean(user?.two_factor_enabled);
  const [setup, setSetup] = useState<TwoFactorSetup | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [recoveryCodes, setRecoveryCodes] = useState<string[] | null>(null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  const stage: TwoFactorStage = setup
    ? "provisioning"
    : isEnabled
      ? "confirmed"
      : "idle";

  function syncEnabledState(enabled: boolean) {
    if (user) {
      setUser({ ...user, two_factor_enabled: enabled });
    }
    queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
  }

  const enableMutation = useMutation({
    mutationFn: enableTwoFactor,
    onSuccess: (response) => {
      setSetup(response.data);
      setCodeError(null);
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "twoFactorEnableError"));
    },
  });

  const confirmMutation = useMutation({
    mutationFn: (code: string) => confirmTwoFactor({ code }),
    onSuccess: () => {
      setSetup(null);
      setCodeError(null);
      syncEnabledState(true);
      toast.success(t("twoFactorEnabled"));
    },
    onError: (error) => {
      if (isFormValidationHttpError(error)) {
        setCodeError(error.fieldErrors.code?.[0] ?? error.message);
        return;
      }

      toast.error(resolveHttpErrorMessage(error, t, "twoFactorConfirmError"));
    },
  });

  const disableMutation = useMutation({
    mutationFn: (password: string) => disableTwoFactor(password),
    onMutate: () => setConfirmError(null),
    onSuccess: () => {
      setSetup(null);
      setCodeError(null);
      setRecoveryCodes(null);
      syncEnabledState(false);
      toast.success(t("twoFactorDisabled"));
    },
    onError: (error) => {
      if (isFormValidationHttpError(error)) {
        setConfirmError(error.fieldErrors.password?.[0] ?? error.message);
        return;
      }

      toast.error(resolveHttpErrorMessage(error, t, "twoFactorDisableError"));
    },
  });

  const regenerateMutation = useMutation({
    mutationFn: (password: string) => regenerateRecoveryCodes(password),
    onMutate: () => setConfirmError(null),
    onSuccess: (response) => {
      setRecoveryCodes(response.data.recovery_codes);
      toast.success(t("twoFactorRecoveryCodesRegenerated"));
    },
    onError: (error) => {
      if (isFormValidationHttpError(error)) {
        setConfirmError(error.fieldErrors.password?.[0] ?? error.message);
        return;
      }

      toast.error(
        resolveHttpErrorMessage(error, t, "twoFactorRecoveryCodesError"),
      );
    },
  });

  return {
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
  };
}

"use client";

import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { resendVerificationEmail } from "@/services/authService";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

export function useResendVerificationEmail() {
  const t = useTranslations("toasts");

  return useMutation({
    mutationFn: resendVerificationEmail,
    onSuccess: () => {
      toast.success(t("verificationResent"));
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "verificationResendError"));
    },
  });
}

"use client";

import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { ForgotPasswordFormValues } from "@/app/forgot-password/_schemas/forgotPasswordSchema";
import { forgotPassword } from "@/services/authService";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

interface UseForgotPasswordOptions {
  setError: UseFormSetError<ForgotPasswordFormValues>;
  onSent: () => void;
}

export function useForgotPassword({
  setError,
  onSent,
}: UseForgotPasswordOptions) {
  const t = useTranslations("toasts");

  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: () => {
      onSent();
    },
    onError: (error) => {
      const handled = handleFormValidationError(error, setError);

      if (!handled) {
        toast.error(resolveHttpErrorMessage(error, t, "forgotError"));
      }
    },
  });
}

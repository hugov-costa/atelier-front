"use client";

import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { ChangePasswordFormValues } from "@/app/(dashboard)/account/_schemas/changePasswordSchema";
import { updatePassword } from "@/services/authService";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

const SERVER_TO_FORM_FIELD_MAP: Record<string, string> = {
  current_password: "currentPassword",
  password_confirmation: "passwordConfirmation",
};

interface UseChangePasswordOptions {
  setError: UseFormSetError<ChangePasswordFormValues>;
  onChanged: () => void;
}

export function useChangePassword({
  setError,
  onChanged,
}: UseChangePasswordOptions) {
  const t = useTranslations("toasts");

  return useMutation({
    mutationFn: (values: ChangePasswordFormValues) =>
      updatePassword({
        current_password: values.currentPassword,
        password: values.password,
        password_confirmation: values.passwordConfirmation,
      }),
    onSuccess: () => {
      toast.success(t("passwordChanged"));
      onChanged();
    },
    onError: (error) => {
      const handled = handleFormValidationError(
        error,
        setError,
        SERVER_TO_FORM_FIELD_MAP,
      );

      if (!handled) {
        toast.error(resolveHttpErrorMessage(error, t, "passwordChangeError"));
      }
    },
  });
}

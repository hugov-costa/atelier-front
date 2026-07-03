"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { ResetPasswordFormValues } from "@/app/reset-password/_schemas/resetPasswordSchema";
import { loginRoute } from "@/app/config/routes";
import { ResetPasswordPayload } from "@/interfaces/password";
import { resetPassword } from "@/services/authService";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { isFormValidationHttpError } from "@/utils/formValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

interface UseResetPasswordOptions {
  token: string;
  email: string;
  setError: UseFormSetError<ResetPasswordFormValues>;
}

const SERVER_TO_FORM_FIELD_MAP: Record<string, string> = {
  password_confirmation: "passwordConfirmation",
};

export function useResetPassword({
  token,
  email,
  setError,
}: UseResetPasswordOptions) {
  const t = useTranslations("toasts");
  const router = useRouter();

  return useMutation({
    mutationFn: (values: ResetPasswordFormValues) => {
      const payload: ResetPasswordPayload = {
        token,
        email,
        password: values.password,
        password_confirmation: values.passwordConfirmation,
      };

      return resetPassword(payload);
    },
    onSuccess: () => {
      toast.success(t("passwordResetSuccess"));
      router.replace(loginRoute);
    },
    onError: (error) => {
      handleFormValidationError(error, setError, SERVER_TO_FORM_FIELD_MAP);

      const tokenError = isFormValidationHttpError(error)
        ? error.fieldErrors.email?.[0]
        : undefined;

      if (tokenError) {
        toast.error(tokenError);
        return;
      }

      if (!isFormValidationHttpError(error)) {
        toast.error(resolveHttpErrorMessage(error, t, "passwordResetError"));
      }
    },
  });
}

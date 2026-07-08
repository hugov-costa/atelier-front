"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { SetPasswordFormValues } from "@/app/set-password/_schemas/setPasswordSchema";
import { loginRoute } from "@/app/config/routes";
import { ConfirmSetPasswordPayload } from "@/interfaces/password";
import { confirmSetPassword } from "@/services/authService";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { isFormValidationHttpError } from "@/utils/formValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

interface UseSetPasswordOptions {
  token: string;
  email: string;
  setError: UseFormSetError<SetPasswordFormValues>;
}

const SERVER_TO_FORM_FIELD_MAP: Record<string, string> = {
  password_confirmation: "passwordConfirmation",
};

export function useSetPassword({
  token,
  email,
  setError,
}: UseSetPasswordOptions) {
  const t = useTranslations("toasts");
  const router = useRouter();

  return useMutation({
    mutationFn: (values: SetPasswordFormValues) => {
      const payload: ConfirmSetPasswordPayload = {
        token,
        email,
        password: values.password,
        password_confirmation: values.passwordConfirmation,
      };

      return confirmSetPassword(payload);
    },
    onSuccess: () => {
      toast.success(t("passwordSetSuccess"));
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

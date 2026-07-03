"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { RegisterFormValues } from "@/app/register/_schemas/registerSchema";
import { loginRoute } from "@/app/config/routes";
import { RegisterPayload } from "@/interfaces/register";
import { register } from "@/services/authService";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

const SERVER_TO_FORM_FIELD_MAP: Record<string, string> = {
  password_confirmation: "passwordConfirmation",
};

function toRegisterPayload(values: RegisterFormValues): RegisterPayload {
  return {
    name: values.name,
    email: values.email,
    password: values.password,
    password_confirmation: values.passwordConfirmation,
  };
}

export function useRegister(setError: UseFormSetError<RegisterFormValues>) {
  const t = useTranslations("toasts");
  const router = useRouter();

  return useMutation({
    mutationFn: (values: RegisterFormValues) =>
      register(toRegisterPayload(values)),
    onSuccess: () => {
      toast.success(t("registerSuccess"));
      router.replace(loginRoute);
    },
    onError: (error) => {
      const handled = handleFormValidationError(
        error,
        setError,
        SERVER_TO_FORM_FIELD_MAP,
      );

      if (!handled) {
        toast.error(resolveHttpErrorMessage(error, t, "registerError"));
      }
    },
  });
}

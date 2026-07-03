"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { LoginFormValues } from "@/app/login/_schemas/loginSchema";
import { defaultAuthenticatedRoute } from "@/app/config/routes";
import { useUser } from "@/contexts/user-context";
import { queryKeys } from "@/lib/queryKeys";
import { login } from "@/services/authService";
import { resolveSafeRedirectPath } from "@/lib/session-redirect";
import { isFormValidationHttpError } from "@/utils/formValidationError";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

function resolveLoginRedirect(): string {
  if (typeof window === "undefined") {
    return defaultAuthenticatedRoute;
  }

  const target = new URLSearchParams(window.location.search).get("redirect");

  return resolveSafeRedirectPath(target, defaultAuthenticatedRoute);
}

interface UseLoginOptions {
  setError: UseFormSetError<LoginFormValues>;
  onTwoFactorRequired: () => void;
}

export function useLogin({ setError, onTwoFactorRequired }: UseLoginOptions) {
  const t = useTranslations("toasts");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setUser } = useUser();

  return useMutation({
    mutationFn: login,
    onSuccess: (response) => {
      const authenticatedUser = response.data?.user;

      queryClient.clear();

      if (authenticatedUser) {
        setUser(authenticatedUser);
      }

      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
      toast.success(t("loginSuccess"));
      router.replace(resolveLoginRedirect());
      router.refresh();
    },
    onError: (error) => {
      if (isFormValidationHttpError(error) && error.fieldErrors.code) {
        onTwoFactorRequired();
      }

      const handled = handleFormValidationError(error, setError);

      if (!handled) {
        toast.error(resolveHttpErrorMessage(error, t, "loginError"));
      }
    },
  });
}

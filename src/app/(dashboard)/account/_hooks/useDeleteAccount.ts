"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { DeleteAccountFormValues } from "@/app/(dashboard)/account/_schemas/deleteAccountSchema";
import { loginRoute } from "@/app/config/routes";
import { useUser } from "@/contexts/user-context";
import { deleteAccount } from "@/services/authService";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

interface UseDeleteAccountOptions {
  setError: UseFormSetError<DeleteAccountFormValues>;
}

export function useDeleteAccount({ setError }: UseDeleteAccountOptions) {
  const t = useTranslations("toasts");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clearUser } = useUser();

  return useMutation({
    mutationFn: (values: DeleteAccountFormValues) => deleteAccount(values),
    onSuccess: () => {
      clearUser();
      queryClient.clear();
      toast.success(t("accountDeleted"));
      router.replace(loginRoute);
      router.refresh();
    },
    onError: (error) => {
      const handled = handleFormValidationError(error, setError);

      if (!handled) {
        toast.error(resolveHttpErrorMessage(error, t, "accountDeleteError"));
      }
    },
  });
}

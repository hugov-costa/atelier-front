"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { UserFormValues } from "@/app/(dashboard)/users/_schemas/userSchema";
import { CreateUserPayload } from "@/interfaces/userResponse";
import { queryKeys } from "@/lib/queryKeys";
import { createUser } from "@/services/userService";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

interface UseCreateUserMutationOptions {
  onCreated?: () => void;
  setError: UseFormSetError<UserFormValues>;
}

export function useCreateUserMutation({
  onCreated,
  setError,
}: UseCreateUserMutationOptions) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => createUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.usersLists });
      toast.success(t("userCreated"));
      onCreated?.();
    },
    onError: (error) => {
      if (!handleFormValidationError(error, setError)) {
        toast.error(resolveHttpErrorMessage(error, t, "userCreateError"));
      }
    },
  });
}

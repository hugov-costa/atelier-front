"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { UserFormValues } from "@/app/(dashboard)/users/_schemas/userSchema";
import { UpdateUserPayload } from "@/interfaces/userResponse";
import { queryKeys } from "@/lib/queryKeys";
import { updateUser } from "@/services/userService";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

interface UseUpdateUserMutationOptions {
  userId: string;
  setError: UseFormSetError<UserFormValues>;
  onUpdated?: () => void;
}

export function useUpdateUserMutation({
  userId,
  setError,
  onUpdated,
}: UseUpdateUserMutationOptions) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(userId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.usersLists });
      toast.success(t("userUpdated"));
      onUpdated?.();
    },
    onError: (error) => {
      const handled = handleFormValidationError(error, setError);

      if (!handled) {
        toast.error(resolveHttpErrorMessage(error, t, "userUpdateError"));
      }
    },
  });
}

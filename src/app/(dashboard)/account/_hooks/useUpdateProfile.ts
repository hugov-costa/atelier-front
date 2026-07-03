"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { ProfileFormValues } from "@/app/(dashboard)/account/_schemas/profileSchema";
import { useUser } from "@/contexts/user-context";
import { UpdateUserPayload } from "@/interfaces/userResponse";
import { queryKeys } from "@/lib/queryKeys";
import { updateUser } from "@/services/userService";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

const SERVER_TO_FORM_FIELD_MAP: Record<string, string> = {
  current_password: "currentPassword",
};

interface UseUpdateProfileOptions {
  userId: string;
  setError: UseFormSetError<ProfileFormValues>;
}

export function useUpdateProfile({
  userId,
  setError,
}: UseUpdateProfileOptions) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();
  const { setUser } = useUser();

  return useMutation({
    mutationFn: (payload: UpdateUserPayload) => updateUser(userId, payload),
    onSuccess: (response) => {
      setUser(response.data);
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
      queryClient.invalidateQueries({ queryKey: queryKeys.user(userId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.usersLists });
      toast.success(t("profileUpdated"));
    },
    onError: (error) => {
      const handled = handleFormValidationError(
        error,
        setError,
        SERVER_TO_FORM_FIELD_MAP,
      );

      if (!handled) {
        toast.error(resolveHttpErrorMessage(error, t, "profileUpdateError"));
      }
    },
  });
}

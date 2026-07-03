"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { useUser } from "@/contexts/user-context";
import { queryKeys } from "@/lib/queryKeys";
import { deleteAvatar, uploadAvatar } from "@/services/avatarService";
import { isFormValidationHttpError } from "@/utils/formValidationError";
import {
  resolveHttpErrorMessage,
  ToastTranslator,
} from "@/utils/resolveHttpErrorMessage";

function resolveAvatarError(
  error: unknown,
  t: ToastTranslator,
  fallbackKey: string,
): string {
  if (isFormValidationHttpError(error)) {
    return error.fieldErrors.avatar?.[0] ?? error.message;
  }

  return resolveHttpErrorMessage(error, t, fallbackKey);
}

export function useAvatar(userId: string) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();
  const { setUser } = useUser();

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadAvatar(userId, file),
    onSuccess: (response) => {
      setUser(response.data);
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
      toast.success(t("avatarUpdated"));
    },
    onError: (error) => {
      toast.error(resolveAvatarError(error, t, "avatarUploadError"));
    },
  });

  const removeMutation = useMutation({
    mutationFn: () => deleteAvatar(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.currentUser });
      toast.success(t("avatarRemoved"));
    },
    onError: (error) => {
      toast.error(resolveAvatarError(error, t, "avatarRemoveError"));
    },
  });

  return { uploadMutation, removeMutation };
}

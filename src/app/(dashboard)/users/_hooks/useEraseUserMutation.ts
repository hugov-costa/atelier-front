"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { queryKeys } from "@/lib/queryKeys";
import { eraseUser } from "@/services/userService";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

interface UseEraseUserMutationOptions {
  onErased?: () => void;
}

export function useEraseUserMutation({
  onErased,
}: UseEraseUserMutationOptions = {}) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => eraseUser(userId),
    onSuccess: (_data, userId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.usersLists });
      queryClient.removeQueries({ queryKey: queryKeys.user(userId) });
      toast.success(t("userErased"));
      onErased?.();
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "userEraseError"));
    },
  });
}

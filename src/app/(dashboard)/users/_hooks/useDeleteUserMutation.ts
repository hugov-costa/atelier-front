"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { queryKeys } from "@/lib/queryKeys";
import { deleteUser } from "@/services/userService";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

interface UseDeleteUserMutationOptions {
  onDeleted?: () => void;
}

export function useDeleteUserMutation({
  onDeleted,
}: UseDeleteUserMutationOptions = {}) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => deleteUser(userId),
    onSuccess: (_data, userId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.usersLists });
      queryClient.removeQueries({ queryKey: queryKeys.user(userId) });
      toast.success(t("userDeleted"));
      onDeleted?.();
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "userDeleteError"));
    },
  });
}

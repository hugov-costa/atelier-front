"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { queryKeys } from "@/lib/queryKeys";
import { deleteLogo, uploadLogo } from "@/services/settingsService";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

export function useLogo() {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: (file: File) => uploadLogo(file),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKeys.settings, response);
      toast.success(t("logoUpdated"));
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "logoUploadError"));
    },
  });

  const removeMutation = useMutation({
    mutationFn: () => deleteLogo(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings });
      toast.success(t("logoRemoved"));
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "logoRemoveError"));
    },
  });

  return { removeMutation, uploadMutation };
}

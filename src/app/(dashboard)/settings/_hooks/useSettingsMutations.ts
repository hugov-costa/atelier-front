"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { SettingsFormValues } from "@/app/(dashboard)/settings/_schemas/settingsSchema";
import { UpdateSettingsPayload } from "@/interfaces/settings";
import { queryKeys } from "@/lib/queryKeys";
import { updateSettings } from "@/services/settingsService";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

interface UseUpdateSettingsOptions {
  setError: UseFormSetError<SettingsFormValues>;
}

export function useUpdateSettings({ setError }: UseUpdateSettingsOptions) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSettingsPayload) => updateSettings(payload),
    onSuccess: (response) => {
      queryClient.setQueryData(queryKeys.settings, response);
      toast.success(t("updated"));
    },
    onError: (error) => {
      if (!handleFormValidationError(error, setError)) {
        toast.error(resolveHttpErrorMessage(error, t, "updateError"));
      }
    },
  });
}

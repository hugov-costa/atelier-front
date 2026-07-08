"use client";

import { useMutation } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { exportAccountData } from "@/services/authService";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

const EXPORT_FILE_NAME = "account-data.json";

function triggerJsonDownload(data: unknown): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = EXPORT_FILE_NAME;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export function useExportAccountData() {
  const t = useTranslations("toasts");

  return useMutation({
    mutationFn: exportAccountData,
    onSuccess: (data) => {
      triggerJsonDownload(data);
      toast.success(t("accountExported"));
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "accountExportError"));
    },
  });
}

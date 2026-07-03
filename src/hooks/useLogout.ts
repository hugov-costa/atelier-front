"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

import { loginRoute } from "@/app/config/routes";
import { useUser } from "@/contexts/user-context";
import { logout } from "@/services/authService";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

export function useLogout() {
  const t = useTranslations("toasts");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { clearUser } = useUser();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      clearUser();
      queryClient.clear();
      toast.success(t("logoutSuccess"));
      router.replace(loginRoute);
      router.refresh();
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "logoutError"));
    },
  });
}

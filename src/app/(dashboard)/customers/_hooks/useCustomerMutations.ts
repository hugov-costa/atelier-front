"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { CustomerFormValues } from "@/app/(dashboard)/customers/_schemas/customerSchema";
import {
  CreateCustomerPayload,
  UpdateCustomerPayload,
} from "@/interfaces/customer";
import { queryKeys } from "@/lib/queryKeys";
import {
  createCustomer,
  deleteCustomer,
  updateCustomer,
} from "@/services/customerService";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

interface UseCustomerFormMutationOptions {
  onSuccess?: () => void;
  setError: UseFormSetError<CustomerFormValues>;
}

export function useCreateCustomer({
  onSuccess,
  setError,
}: UseCustomerFormMutationOptions) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCustomerPayload) => createCustomer(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customersLists });
      toast.success(t("created"));
      onSuccess?.();
    },
    onError: (error) => {
      if (!handleFormValidationError(error, setError)) {
        toast.error(resolveHttpErrorMessage(error, t, "createError"));
      }
    },
  });
}

export function useDeleteCustomer() {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (customerId: string) => deleteCustomer(customerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customersLists });
      toast.success(t("deleted"));
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "deleteError"));
    },
  });
}

export function useUpdateCustomer({
  customerId,
  onSuccess,
  setError,
}: UseCustomerFormMutationOptions & { customerId: string }) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCustomerPayload) =>
      updateCustomer(customerId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customersLists });
      queryClient.invalidateQueries({
        queryKey: queryKeys.customer(customerId),
      });
      toast.success(t("updated"));
      onSuccess?.();
    },
    onError: (error) => {
      if (!handleFormValidationError(error, setError)) {
        toast.error(resolveHttpErrorMessage(error, t, "updateError"));
      }
    },
  });
}

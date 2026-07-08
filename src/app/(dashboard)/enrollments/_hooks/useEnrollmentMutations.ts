"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { UseFormSetError } from "react-hook-form";
import { toast } from "sonner";

import { EnrollmentFormValues } from "@/app/(dashboard)/enrollments/_schemas/enrollmentSchema";
import {
  CreateEnrollmentPayload,
  UpdateEnrollmentPayload,
} from "@/interfaces/enrollment";
import { queryKeys } from "@/lib/queryKeys";
import {
  createEnrollment,
  deleteEnrollment,
  updateEnrollment,
} from "@/services/enrollmentService";
import { handleFormValidationError } from "@/utils/handleFormValidationError";
import { resolveHttpErrorMessage } from "@/utils/resolveHttpErrorMessage";

interface UseEnrollmentFormMutationOptions {
  onSuccess?: () => void;
  setError: UseFormSetError<EnrollmentFormValues>;
}

export function useCreateEnrollment({
  onSuccess,
  setError,
}: UseEnrollmentFormMutationOptions) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateEnrollmentPayload) => createEnrollment(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.enrollmentsLists,
      });
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

export function useDeleteEnrollment() {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (enrollmentId: string) => deleteEnrollment(enrollmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.enrollmentsLists,
      });
      toast.success(t("deleted"));
    },
    onError: (error) => {
      toast.error(resolveHttpErrorMessage(error, t, "deleteError"));
    },
  });
}

export function useUpdateEnrollment({
  enrollmentId,
  onSuccess,
  setError,
}: UseEnrollmentFormMutationOptions & { enrollmentId: string }) {
  const t = useTranslations("toasts");
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateEnrollmentPayload) =>
      updateEnrollment(enrollmentId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.enrollmentsLists,
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.enrollment(enrollmentId),
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

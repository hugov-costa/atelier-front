"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { EnrollmentFormDialog } from "@/app/(dashboard)/enrollments/_components/enrollment-form-dialog";
import { useDeleteEnrollment } from "@/app/(dashboard)/enrollments/_hooks/useEnrollmentMutations";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Enrollment } from "@/interfaces/enrollment";

export function EnrollmentRowActions({
  enrollment,
}: {
  enrollment: Enrollment;
}) {
  const t = useTranslations("enrollments");
  const common = useTranslations("common");
  const deleteEnrollment = useDeleteEnrollment();

  return (
    <div className="flex items-center justify-end gap-2">
      <EnrollmentFormDialog
        enrollment={enrollment}
        trigger={
          <Button variant="outline" size="sm">
            <Pencil className="size-4" />
            {common("edit")}
          </Button>
        }
      />

      <ConfirmDialog
        title={t("deleteTitle")}
        description={t("deleteDescription")}
        confirmLabel={common("delete")}
        cancelLabel={common("cancel")}
        isConfirming={deleteEnrollment.isPending}
        onConfirm={() => deleteEnrollment.mutate(enrollment.id)}
        trigger={
          <Button variant="outline" size="sm">
            <Trash2 className="size-4" />
            {common("delete")}
          </Button>
        }
      />
    </div>
  );
}

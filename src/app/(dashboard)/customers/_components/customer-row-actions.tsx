"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { CustomerFormDialog } from "@/app/(dashboard)/customers/_components/customer-form-dialog";
import { useDeleteCustomer } from "@/app/(dashboard)/customers/_hooks/useCustomerMutations";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Button } from "@/components/ui/button";
import { Customer } from "@/interfaces/customer";

export function CustomerRowActions({ customer }: { customer: Customer }) {
  const t = useTranslations("customers");
  const common = useTranslations("common");
  const deleteCustomer = useDeleteCustomer();

  return (
    <div className="flex items-center justify-end gap-2">
      <CustomerFormDialog
        customer={customer}
        trigger={
          <Button variant="outline" size="sm">
            <Pencil className="size-4" />
            {common("edit")}
          </Button>
        }
      />

      <ConfirmDialog
        title={t("deleteTitle")}
        description={t("deleteDescription", { name: customer.name })}
        confirmLabel={common("delete")}
        cancelLabel={common("cancel")}
        isConfirming={deleteCustomer.isPending}
        onConfirm={() => deleteCustomer.mutate(customer.id)}
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

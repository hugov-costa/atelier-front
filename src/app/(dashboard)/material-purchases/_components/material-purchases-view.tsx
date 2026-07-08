"use client";

import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { useMaterialPurchaseColumns } from "@/app/(dashboard)/material-purchases/_assets/columnDefs";
import { MaterialPurchaseFormDialog } from "@/app/(dashboard)/material-purchases/_components/material-purchase-form-dialog";
import { useMaterialPurchases } from "@/app/(dashboard)/material-purchases/_hooks/useMaterialPurchases";
import { RequirePermission } from "@/components/authorization/require-permission";
import { DataTable } from "@/components/data-table/data-table";
import { PaginationControls } from "@/components/data-table/pagination-controls";
import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuthorization } from "@/hooks/useAuthorization";
import { ListMaterialPurchasesParams } from "@/interfaces/materialPurchase";
import { MaterialType, materialTypes } from "@/lib/enums";

const PER_PAGE = 15;
const ALL_FILTER = "all";

type StatusFilter = "all" | "received" | "pending";
type MaterialTypeFilter = MaterialType | "all";

export const MATERIAL_PURCHASES_INITIAL_PARAMS: ListMaterialPurchasesParams = {
  page: 1,
  perPage: PER_PAGE,
};

export function MaterialPurchasesView() {
  const t = useTranslations("materialPurchases");
  const enumsT = useTranslations("enums");
  const { can } = useAuthorization();
  const columns = useMaterialPurchaseColumns();
  const [page, setPage] = useState(1);
  const [materialType, setMaterialType] =
    useState<MaterialTypeFilter>(ALL_FILTER);
  const [status, setStatus] = useState<StatusFilter>(ALL_FILTER);

  const query = useMaterialPurchases(
    {
      page,
      perPage: PER_PAGE,
      material_type: materialType === ALL_FILTER ? undefined : materialType,
      status: status === ALL_FILTER ? undefined : status,
    },
    { enabled: can("atelier.manage") },
  );

  const onMaterialTypeChange = (value: string) => {
    setPage(1);
    setMaterialType(value as MaterialTypeFilter);
  };

  const onStatusChange = (value: string) => {
    setPage(1);
    setStatus(value as StatusFilter);
  };

  return (
    <RequirePermission permission="atelier.manage" title={t("title")}>
      <div className="space-y-6">
        <PageTitle
          title={t("title")}
          description={t("description")}
          action={
            <MaterialPurchaseFormDialog
              trigger={
                <Button>
                  <Plus className="size-4" />
                  {t("new")}
                </Button>
              }
            />
          }
        />

        <div className="flex flex-wrap gap-3">
          <Select value={materialType} onValueChange={onMaterialTypeChange}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER}>
                {t("filterMaterialTypeAll")}
              </SelectItem>
              {materialTypes.map((value) => (
                <SelectItem key={value} value={value}>
                  {enumsT(`materialType.${value}`)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={status} onValueChange={onStatusChange}>
            <SelectTrigger className="w-52">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ALL_FILTER}>{t("filterStatusAll")}</SelectItem>
              <SelectItem value="received">
                {t("filterStatusReceived")}
              </SelectItem>
              <SelectItem value="pending">
                {t("filterStatusPending")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DataTable
          columns={columns}
          data={query.data?.data ?? []}
          getRowKey={(purchase) => purchase.id}
          isLoading={query.isPending}
          emptyMessage={t("empty")}
        />

        <PaginationControls
          meta={query.data?.meta}
          page={page}
          isFetching={query.isFetching}
          onPageChange={setPage}
        />
      </div>
    </RequirePermission>
  );
}

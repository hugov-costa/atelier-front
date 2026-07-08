import { cache } from "react";

import { AuditFilterParams } from "@/interfaces/audit";
import { ListBillsParams } from "@/interfaces/bill";
import { ListClaysParams } from "@/interfaces/clay";
import { ListClaySuppliersParams } from "@/interfaces/claySupplier";
import { ListCommissionOrdersParams } from "@/interfaces/commissionOrder";
import { ListCustomersParams } from "@/interfaces/customer";
import { ListEnrollmentsParams } from "@/interfaces/enrollment";
import { ListFiringCyclesParams } from "@/interfaces/firingCycle";
import { ListGlazesParams } from "@/interfaces/glaze";
import { ListGlazeSuppliersParams } from "@/interfaces/glazeSupplier";
import { ListMaterialPurchasesParams } from "@/interfaces/materialPurchase";
import { MonthlyReportParams } from "@/interfaces/monthlyReport";
import { ListNotificationsParams } from "@/interfaces/notification";
import { ListPieceChargesParams } from "@/interfaces/pieceCharge";
import { ListPiecesParams } from "@/interfaces/piece";
import { ListPieceCategoriesParams } from "@/interfaces/pieceCategory";
import { ListRecurrentClassesParams } from "@/interfaces/recurrentClass";
import { ListSingleClassesParams } from "@/interfaces/singleClass";
import { ListTuitionFeesParams } from "@/interfaces/tuitionFee";
import { User } from "@/interfaces/user";
import { ListUsersParams } from "@/interfaces/userResponse";
import { buildListQuery } from "@/lib/listQuery";
import {
  auditResponseSchema,
  billResponseSchema,
  clayResponseSchema,
  claySupplierResponseSchema,
  commissionOrderResponseSchema,
  customerResponseSchema,
  enrollmentResponseSchema,
  firingCycleResponseSchema,
  glazeResponseSchema,
  glazeSupplierResponseSchema,
  materialPurchaseResponseSchema,
  monthlyReportResponseSchema,
  notificationResponseSchema,
  paginatedSchema,
  parseApiResponse,
  pieceCategoryResponseSchema,
  pieceChargeResponseSchema,
  pieceResponseSchema,
  recurrentClassResponseSchema,
  resourceSchema,
  settingResponseSchema,
  singleClassResponseSchema,
  tuitionFeeResponseSchema,
  userResponseSchema,
} from "@/lib/responseSchemas";
import { serverApiGet } from "@/lib/server-api";
import { buildAuditQuery } from "@/services/auditService";
import { buildListUsersQuery } from "@/services/userService";

export const fetchCurrentUserOnServer = cache(async (): Promise<User> => {
  const response = await serverApiGet<{ data: User }>("/user");

  return parseApiResponse(userResponseSchema, response.data);
});

export async function fetchUsersOnServer(params: ListUsersParams) {
  const response = await serverApiGet<unknown>(
    `/users${buildListUsersQuery(params)}`,
  );

  return parseApiResponse(paginatedSchema(userResponseSchema), response);
}

export async function fetchUserOnServer(userId: string) {
  const response = await serverApiGet<unknown>(`/users/${userId}`);

  return parseApiResponse(resourceSchema(userResponseSchema), response);
}

export async function fetchAuditsOnServer(params: AuditFilterParams) {
  const response = await serverApiGet<unknown>(
    `/users/audits${buildAuditQuery(params)}`,
  );

  return parseApiResponse(paginatedSchema(auditResponseSchema), response);
}

export async function fetchClaySuppliersOnServer(
  params: ListClaySuppliersParams,
) {
  const response = await serverApiGet<unknown>(
    `/clay-suppliers${buildListQuery(params)}`,
  );

  return parseApiResponse(
    paginatedSchema(claySupplierResponseSchema),
    response,
  );
}

export async function fetchClaysOnServer(params: ListClaysParams) {
  const response = await serverApiGet<unknown>(
    `/clays${buildListQuery(params)}`,
  );

  return parseApiResponse(paginatedSchema(clayResponseSchema), response);
}

export async function fetchCustomersOnServer(params: ListCustomersParams) {
  const response = await serverApiGet<unknown>(
    `/customers${buildListQuery(params)}`,
  );

  return parseApiResponse(paginatedSchema(customerResponseSchema), response);
}

export async function fetchFiringCyclesOnServer(
  params: ListFiringCyclesParams,
) {
  const response = await serverApiGet<unknown>(
    `/firing-cycles${buildListQuery(params)}`,
  );

  return parseApiResponse(paginatedSchema(firingCycleResponseSchema), response);
}

export async function fetchGlazeSuppliersOnServer(
  params: ListGlazeSuppliersParams,
) {
  const response = await serverApiGet<unknown>(
    `/glaze-suppliers${buildListQuery(params)}`,
  );

  return parseApiResponse(
    paginatedSchema(glazeSupplierResponseSchema),
    response,
  );
}

export async function fetchGlazesOnServer(params: ListGlazesParams) {
  const response = await serverApiGet<unknown>(
    `/glazes${buildListQuery(params)}`,
  );

  return parseApiResponse(paginatedSchema(glazeResponseSchema), response);
}

export async function fetchMaterialPurchasesOnServer(
  params: ListMaterialPurchasesParams,
) {
  const response = await serverApiGet<unknown>(
    `/material-purchases${buildListQuery(params)}`,
  );

  return parseApiResponse(
    paginatedSchema(materialPurchaseResponseSchema),
    response,
  );
}

export async function fetchPieceCategoriesOnServer(
  params: ListPieceCategoriesParams,
) {
  const response = await serverApiGet<unknown>(
    `/piece-categories${buildListQuery(params)}`,
  );

  return parseApiResponse(
    paginatedSchema(pieceCategoryResponseSchema),
    response,
  );
}

export async function fetchPiecesOnServer(params: ListPiecesParams) {
  const response = await serverApiGet<unknown>(
    `/pieces${buildListQuery(params)}`,
  );

  return parseApiResponse(paginatedSchema(pieceResponseSchema), response);
}

export async function fetchCommissionOrdersOnServer(
  params: ListCommissionOrdersParams,
) {
  const response = await serverApiGet<unknown>(
    `/commission-orders${buildListQuery(params)}`,
  );

  return parseApiResponse(
    paginatedSchema(commissionOrderResponseSchema),
    response,
  );
}

export async function fetchPieceChargesOnServer(
  params: ListPieceChargesParams,
) {
  const response = await serverApiGet<unknown>(
    `/piece-charges${buildListQuery(params)}`,
  );

  return parseApiResponse(paginatedSchema(pieceChargeResponseSchema), response);
}

export async function fetchSingleClassesOnServer(
  params: ListSingleClassesParams,
) {
  const response = await serverApiGet<unknown>(
    `/single-classes${buildListQuery(params)}`,
  );

  return parseApiResponse(paginatedSchema(singleClassResponseSchema), response);
}

export async function fetchRecurrentClassesOnServer(
  params: ListRecurrentClassesParams,
) {
  const response = await serverApiGet<unknown>(
    `/recurrent-classes${buildListQuery(params)}`,
  );

  return parseApiResponse(
    paginatedSchema(recurrentClassResponseSchema),
    response,
  );
}

export async function fetchEnrollmentsOnServer(params: ListEnrollmentsParams) {
  const response = await serverApiGet<unknown>(
    `/enrollments${buildListQuery(params)}`,
  );

  return parseApiResponse(paginatedSchema(enrollmentResponseSchema), response);
}

export async function fetchBillsOnServer(params: ListBillsParams) {
  const response = await serverApiGet<unknown>(
    `/bills${buildListQuery(params)}`,
  );

  return parseApiResponse(paginatedSchema(billResponseSchema), response);
}

export async function fetchTuitionFeesOnServer(params: ListTuitionFeesParams) {
  const response = await serverApiGet<unknown>(
    `/tuition-fees${buildListQuery(params)}`,
  );

  return parseApiResponse(paginatedSchema(tuitionFeeResponseSchema), response);
}

export async function fetchSettingsOnServer() {
  const response = await serverApiGet<unknown>("/settings");

  return parseApiResponse(resourceSchema(settingResponseSchema), response);
}

export async function fetchNotificationsOnServer(
  params: ListNotificationsParams,
) {
  const response = await serverApiGet<unknown>(
    `/notifications${buildListQuery(params)}`,
  );

  return parseApiResponse(
    paginatedSchema(notificationResponseSchema),
    response,
  );
}

export async function fetchMonthlyReportOnServer(params: MonthlyReportParams) {
  const response = await serverApiGet<unknown>(
    `/reports/monthly${buildListQuery(params)}`,
  );

  return parseApiResponse(resourceSchema(monthlyReportResponseSchema), response)
    .data;
}

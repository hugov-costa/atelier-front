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
import { ListPieceChargesParams } from "@/interfaces/pieceCharge";
import { ListPiecesParams } from "@/interfaces/piece";
import { ListPieceCategoriesParams } from "@/interfaces/pieceCategory";
import { MonthlyReportParams } from "@/interfaces/monthlyReport";
import { ListNotificationsParams } from "@/interfaces/notification";
import { ListRecurrentClassesParams } from "@/interfaces/recurrentClass";
import { ListSingleClassesParams } from "@/interfaces/singleClass";
import { ListTuitionFeesParams } from "@/interfaces/tuitionFee";
import { ListUsersParams } from "@/interfaces/userResponse";

export const queryKeys = {
  currentUser: ["current-user"] as const,
  usersLists: ["users", "list"] as const,
  usersList: (params: ListUsersParams) => ["users", "list", params] as const,
  user: (userId: string) => ["users", "detail", userId] as const,
  studentStatement: (studentId: string) =>
    ["students", "statement", studentId] as const,
  audits: (params: AuditFilterParams) => ["audits", params] as const,
  userAudits: (userId: string, params: AuditFilterParams) =>
    ["audits", userId, params] as const,
  claysLists: ["clays", "list"] as const,
  claysList: (params: ListClaysParams) => ["clays", "list", params] as const,
  clay: (clayId: string) => ["clays", "detail", clayId] as const,
  claySuppliersLists: ["clay-suppliers", "list"] as const,
  claySuppliersList: (params: ListClaySuppliersParams) =>
    ["clay-suppliers", "list", params] as const,
  claySupplier: (claySupplierId: string) =>
    ["clay-suppliers", "detail", claySupplierId] as const,
  customersLists: ["customers", "list"] as const,
  customersList: (params: ListCustomersParams) =>
    ["customers", "list", params] as const,
  customer: (customerId: string) =>
    ["customers", "detail", customerId] as const,
  firingCyclesLists: ["firing-cycles", "list"] as const,
  firingCyclesList: (params: ListFiringCyclesParams) =>
    ["firing-cycles", "list", params] as const,
  firingCycle: (firingCycleId: string) =>
    ["firing-cycles", "detail", firingCycleId] as const,
  glazesLists: ["glazes", "list"] as const,
  glazesList: (params: ListGlazesParams) => ["glazes", "list", params] as const,
  glaze: (glazeId: string) => ["glazes", "detail", glazeId] as const,
  glazeSuppliersLists: ["glaze-suppliers", "list"] as const,
  glazeSuppliersList: (params: ListGlazeSuppliersParams) =>
    ["glaze-suppliers", "list", params] as const,
  glazeSupplier: (glazeSupplierId: string) =>
    ["glaze-suppliers", "detail", glazeSupplierId] as const,
  materialPurchasesLists: ["material-purchases", "list"] as const,
  materialPurchasesList: (params: ListMaterialPurchasesParams) =>
    ["material-purchases", "list", params] as const,
  materialPurchase: (materialPurchaseId: string) =>
    ["material-purchases", "detail", materialPurchaseId] as const,
  pieceCategoriesLists: ["piece-categories", "list"] as const,
  pieceCategoriesList: (params: ListPieceCategoriesParams) =>
    ["piece-categories", "list", params] as const,
  pieceCategory: (pieceCategoryId: string) =>
    ["piece-categories", "detail", pieceCategoryId] as const,
  piecesLists: ["pieces", "list"] as const,
  piecesList: (params: ListPiecesParams) => ["pieces", "list", params] as const,
  piece: (pieceId: string) => ["pieces", "detail", pieceId] as const,
  commissionOrdersLists: ["commission-orders", "list"] as const,
  commissionOrdersList: (params: ListCommissionOrdersParams) =>
    ["commission-orders", "list", params] as const,
  commissionOrder: (commissionOrderId: string) =>
    ["commission-orders", "detail", commissionOrderId] as const,
  pieceChargesLists: ["piece-charges", "list"] as const,
  pieceChargesList: (params: ListPieceChargesParams) =>
    ["piece-charges", "list", params] as const,
  pieceCharge: (pieceChargeId: string) =>
    ["piece-charges", "detail", pieceChargeId] as const,
  singleClassesLists: ["single-classes", "list"] as const,
  singleClassesList: (params: ListSingleClassesParams) =>
    ["single-classes", "list", params] as const,
  singleClass: (singleClassId: string) =>
    ["single-classes", "detail", singleClassId] as const,
  recurrentClassesLists: ["recurrent-classes", "list"] as const,
  recurrentClassesList: (params: ListRecurrentClassesParams) =>
    ["recurrent-classes", "list", params] as const,
  recurrentClass: (recurrentClassId: string) =>
    ["recurrent-classes", "detail", recurrentClassId] as const,
  enrollmentsLists: ["enrollments", "list"] as const,
  enrollmentsList: (params: ListEnrollmentsParams) =>
    ["enrollments", "list", params] as const,
  enrollment: (enrollmentId: string) =>
    ["enrollments", "detail", enrollmentId] as const,
  billsLists: ["bills", "list"] as const,
  billsList: (params: ListBillsParams) => ["bills", "list", params] as const,
  bill: (billId: string) => ["bills", "detail", billId] as const,
  tuitionFeesLists: ["tuition-fees", "list"] as const,
  tuitionFeesList: (params: ListTuitionFeesParams) =>
    ["tuition-fees", "list", params] as const,
  tuitionFee: (tuitionFeeId: string) =>
    ["tuition-fees", "detail", tuitionFeeId] as const,
  monthlyReport: (params: MonthlyReportParams) =>
    ["reports", "monthly", params] as const,
  settings: ["settings"] as const,
  notificationsLists: ["notifications", "list"] as const,
  notificationsList: (params: ListNotificationsParams) =>
    ["notifications", "list", params] as const,
};

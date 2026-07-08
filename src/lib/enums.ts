export const daysOfWeek = [1, 2, 3, 4, 5, 6, 7] as const;

export type DayOfWeek = (typeof daysOfWeek)[number];

export const materialTypes = ["clay", "glaze"] as const;

export type MaterialType = (typeof materialTypes)[number];

export const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] as const;

export type Month = (typeof months)[number];

export const orderStatuses = [
  "pending",
  "in_production",
  "ready",
  "delivered",
] as const;

export type OrderStatus = (typeof orderStatuses)[number];

export const paymentMethods = [
  "bank_slip",
  "bank_transfer",
  "cash",
  "credit_card",
  "debit_card",
  "pix",
] as const;

export type PaymentMethod = (typeof paymentMethods)[number];

export const pieceKinds = ["commission", "student"] as const;

export type PieceKind = (typeof pieceKinds)[number];

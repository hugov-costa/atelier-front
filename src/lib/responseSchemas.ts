import { z, ZodType } from "zod";

import { HttpError } from "@/utils/httpError";
import { HttpStatusType } from "@/types/httpStatus";

export const userRoleSchema = z.enum(["user", "admin", "master"]);

export const userResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: userRoleSchema.nullish(),
  admission_date: z.string().nullish(),
  avatar_url: z.string().nullish(),
  birthday: z.string().nullish(),
  email_verified_at: z.string().nullish(),
  has_password: z.boolean().nullish(),
  impersonated_by: z.string().nullish(),
  is_active: z.boolean().nullish(),
  phone: z.string().nullish(),
  two_factor_enabled: z.boolean().nullish(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

const paginationLinksSchema = z.object({
  first: z.string().nullable(),
  last: z.string().nullable(),
  prev: z.string().nullable(),
  next: z.string().nullable(),
});

const paginationMetaSchema = z.object({
  current_page: z.number(),
  from: z.number().nullable(),
  last_page: z.number(),
  per_page: z.number(),
  to: z.number().nullable(),
  total: z.number(),
});

export function resourceSchema<TSchema extends ZodType>(item: TSchema) {
  return z.object({
    data: item,
    message: z.string().nullish(),
  });
}

export function paginatedSchema<TSchema extends ZodType>(item: TSchema) {
  return z.object({
    data: z.array(item),
    links: paginationLinksSchema,
    meta: paginationMetaSchema,
  });
}

export const loginResponseSchema = z.object({
  data: z.object({
    user: userResponseSchema,
    token: z.string().nullish(),
    token_type: z.string().nullish(),
  }),
  message: z.string().nullish(),
});

export const auditResponseSchema = z.object({
  id: z.number(),
  event: z.enum(["created", "updated", "deleted", "restored"]),
  auditable_type: z.string(),
  auditable_id: z.union([z.string(), z.number()]).nullish(),
  user_id: z.union([z.string(), z.number()]).nullish(),
  impersonator_id: z.union([z.string(), z.number()]).nullish(),
  old_values: z.record(z.string(), z.unknown()).default({}),
  new_values: z.record(z.string(), z.unknown()).default({}),
  ip_address: z.string().nullish(),
  url: z.string().nullish(),
  created_at: z.string(),
});

export const customerResponseSchema = z.object({
  id: z.string(),
  description: z.string().nullish(),
  email: z.string().nullish(),
  name: z.string(),
  phone: z.string().nullish(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export const claySupplierResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  phone: z.string(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export const clayResponseSchema = z.object({
  id: z.string(),
  clay_supplier_id: z.string(),
  description: z.string().nullish(),
  name: z.string(),
  price: z.number(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export const glazeSupplierResponseSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  phone: z.string(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export const glazeResponseSchema = z.object({
  id: z.string(),
  glaze_supplier_id: z.string(),
  description: z.string().nullish(),
  name: z.string(),
  price: z.number(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export const pieceCategoryResponseSchema = z.object({
  id: z.string(),
  available_until: z.string().nullish(),
  is_available: z.boolean(),
  name: z.string(),
  profit_margin: z.number(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export const firingCycleResponseSchema = z.object({
  id: z.string(),
  cycle: z.number(),
  duration: z.number(),
  name: z.string(),
  price_per_unit: z.number(),
  temperature: z.number(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

const materialReferenceSchema = z.object({
  id: z.string().nullable(),
  name: z.string().nullable(),
  type: z.string(),
});

export const materialPurchaseResponseSchema = z.object({
  id: z.string(),
  description: z.string().nullish(),
  freight: z.number(),
  invoice_number: z.string().nullish(),
  is_received: z.boolean(),
  lot: z.string().nullish(),
  material: materialReferenceSchema,
  payment_method: z.string(),
  purchase_date: z.string(),
  quantity: z.number(),
  receipt_date: z.string().nullish(),
  supplier: materialReferenceSchema,
  total_price: z.number(),
  unit_price: z.number(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export const pieceFiringCycleSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
});

export const pieceResponseSchema = z.object({
  id: z.string(),
  clay_id: z.string(),
  glaze_id: z.string().nullish(),
  piece_category_id: z.string().nullish(),
  user_id: z.string(),
  base_cost: z.number(),
  clay_amount: z.number(),
  clay_unit_price: z.number(),
  firing_cycles: z.array(pieceFiringCycleSchema).optional(),
  glaze_amount: z.number().nullish(),
  glaze_unit_price: z.number().nullish(),
  kind: z.string(),
  name: z.string(),
  price: z.number(),
  production_cost: z.number(),
  profit_margin: z.number().nullish(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

const commissionOrderCustomerSchema = z.object({
  id: z.string(),
  name: z.string(),
});

const commissionOrderPieceSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
  production_cost: z.number(),
});

export const commissionOrderResponseSchema = z.object({
  id: z.string(),
  customer: commissionOrderCustomerSchema.nullish(),
  delivery_date: z.string().nullish(),
  description: z.string().nullish(),
  is_paid: z.boolean(),
  order_date: z.string(),
  paid_at: z.string().nullish(),
  pieces: z.array(commissionOrderPieceSchema).optional(),
  pieces_total: z.number(),
  production_cost_total: z.number(),
  realized_margin: z.number(),
  sale_total: z.number(),
  sale_total_override: z.number().nullish(),
  shipping_charged: z.number(),
  shipping_cost: z.number(),
  status: z.string(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export const pieceChargeResponseSchema = z.object({
  id: z.string(),
  amount: z.number(),
  due_date: z.string(),
  is_paid: z.boolean(),
  paid_at: z.string().nullish(),
  piece_id: z.string(),
  user_id: z.string(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

const classMemberSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const singleClassResponseSchema = z.object({
  id: z.string(),
  end_datetime: z.string(),
  is_replacement: z.boolean(),
  price: z.number().nullish(),
  start_datetime: z.string(),
  users: z.array(classMemberSchema).optional(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export const recurrentClassResponseSchema = z.object({
  id: z.string(),
  day_of_the_week: z.number(),
  end_time: z.string(),
  start_time: z.string(),
  users: z.array(classMemberSchema).optional(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export const enrollmentResponseSchema = z.object({
  id: z.string(),
  annual_fee: z.number(),
  annual_fee_due_date: z.string().nullish(),
  annual_fee_is_paid: z.boolean(),
  annual_fee_paid_at: z.string().nullish(),
  is_exempt_from_annual_fee: z.boolean(),
  is_exempt_from_piece_charges: z.boolean(),
  is_exempt_from_tuition_fee: z.boolean(),
  user_id: z.string(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export const billResponseSchema = z.object({
  id: z.string(),
  description: z.string().nullish(),
  due_date: z.string(),
  is_recurrent: z.boolean(),
  name: z.string(),
  reference_month: z.number(),
  reference_year: z.number(),
  value: z.number(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

export const tuitionFeeResponseSchema = z.object({
  id: z.string(),
  amount: z.number(),
  due_date: z.string(),
  enrollment_id: z.string(),
  is_paid: z.boolean(),
  paid_at: z.string().nullish(),
  created_at: z.string().nullish(),
  updated_at: z.string().nullish(),
});

const monthlyReportCategorySchema = z.object({
  category: z.string().nullish(),
  count: z.number(),
  margin: z.number(),
  price_total: z.number(),
  production_cost_total: z.number(),
});

export const monthlyReportResponseSchema = z.object({
  commission: z.object({
    orders_paid_count: z.number(),
    production_cost: z.number(),
    realized_margin: z.number(),
    sales: z.number(),
    shipping_cost: z.number(),
  }),
  counts: z.object({
    active_students: z.number(),
    new_enrollments: z.number(),
  }),
  expenses: z.object({
    bills_total: z.number(),
    commission_shipping: z.number(),
    materials_total: z.number(),
    total: z.number(),
  }),
  net: z.number(),
  period: z.object({
    month: z.number(),
    year: z.number(),
  }),
  production: z.object({
    by_category: z.array(monthlyReportCategorySchema),
    pieces_produced: z.number(),
  }),
  revenue: z.object({
    annual_fees_paid: z.number(),
    commission_sales: z.number(),
    piece_charges_paid: z.number(),
    total: z.number(),
    tuition_paid: z.number(),
  }),
  tuition: z.object({
    due_count: z.number(),
    paid_count: z.number(),
    unpaid_count: z.number(),
  }),
});

export const settingResponseSchema = z.object({
  annual_enrollment_cost: z.number(),
  base_cost: z.number(),
  clay_amount_multiplier: z.number(),
  default_profit_margin: z.number(),
  logo_url: z.string().nullish(),
  piece_charge_billing_grace_days: z.number(),
  tuition_fee_due_day_of_month: z.number(),
  tuition_monthly_cost: z.number(),
  updated_at: z.string().nullish(),
});

export const notificationResponseSchema = z.object({
  id: z.string(),
  data: z.record(z.string(), z.unknown()),
  read_at: z.string().nullish(),
  type: z.string(),
  created_at: z.string().nullish(),
});

const statementItemSchema = z.object({
  id: z.string(),
  amount: z.number(),
  due_date: z.string().nullish(),
  kind: z.string().optional(),
  paid_at: z.string().nullish(),
  piece: z.object({ name: z.string().nullish() }).optional(),
  status: z.string(),
});

export const studentStatementResponseSchema = z.object({
  balance: z.object({
    overdue: z.number(),
    total_outstanding: z.number(),
    upcoming: z.number(),
  }),
  history: z.array(
    z.object({
      amount: z.number(),
      paid_at: z.string(),
      type: z.string(),
    }),
  ),
  items: z.object({
    annual_fees: z.array(statementItemSchema),
    piece_charges: z.array(statementItemSchema),
    tuition: z.array(statementItemSchema),
  }),
  student: z.object({ id: z.string(), name: z.string() }),
});

export const twoFactorSetupResponseSchema = z.object({
  qr_code_url: z.string(),
  recovery_codes: z.array(z.string()),
  secret: z.string(),
});

export const twoFactorRecoveryCodesResponseSchema = z.object({
  recovery_codes: z.array(z.string()),
});

export function parseApiResponse<TSchema extends ZodType>(
  schema: TSchema,
  value: unknown,
): z.infer<TSchema> {
  const result = schema.safeParse(value);

  if (!result.success) {
    throw new HttpError(
      HttpStatusType.INTERNAL_SERVER_ERROR,
      "Resposta inesperada da API.",
      { payload: result.error.issues },
    );
  }

  return result.data;
}

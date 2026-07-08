import { z } from "zod";

import { ResourceResponse } from "@/interfaces/authResponse";
import { PaginatedResponse } from "@/interfaces/paginatedResponse";
import { OrderStatus } from "@/lib/enums";
import { ListParams } from "@/lib/listQuery";
import { commissionOrderResponseSchema } from "@/lib/responseSchemas";

export type CommissionOrder = z.infer<typeof commissionOrderResponseSchema>;

export type ListCommissionOrdersResponse = PaginatedResponse<CommissionOrder>;

export type CommissionOrderResourceResponse = ResourceResponse<CommissionOrder>;

export type ListCommissionOrdersParams = Pick<
  ListParams,
  "page" | "perPage"
> & {
  customer_id?: string;
  paid?: "paid" | "unpaid";
  status?: OrderStatus;
};

export interface CreateCommissionOrderPayload {
  customer_id: string;
  delivery_date?: string | null;
  description?: string | null;
  order_date: string;
  piece_ids?: string[];
  sale_total_override?: number | null;
  shipping_charged?: number;
  shipping_cost?: number;
  status?: OrderStatus;
}

export interface UpdateCommissionOrderPayload {
  delivery_date?: string | null;
  description?: string | null;
  is_paid?: boolean;
  order_date?: string;
  piece_ids?: string[];
  sale_total_override?: number | null;
  shipping_charged?: number;
  shipping_cost?: number;
  status?: OrderStatus;
}

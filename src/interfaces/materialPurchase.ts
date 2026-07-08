import { z } from "zod";

import { ResourceResponse } from "@/interfaces/authResponse";
import { PaginatedResponse } from "@/interfaces/paginatedResponse";
import { MaterialType, PaymentMethod } from "@/lib/enums";
import { ListParams } from "@/lib/listQuery";
import { materialPurchaseResponseSchema } from "@/lib/responseSchemas";

export type MaterialPurchase = z.infer<typeof materialPurchaseResponseSchema>;

export type ListMaterialPurchasesResponse = PaginatedResponse<MaterialPurchase>;

export type MaterialPurchaseResourceResponse =
  ResourceResponse<MaterialPurchase>;

export type ListMaterialPurchasesParams = Pick<
  ListParams,
  "page" | "perPage"
> & {
  material_type?: MaterialType;
  status?: "received" | "pending";
  supplier_id?: string;
};

export interface CreateMaterialPurchasePayload {
  description?: string | null;
  freight?: number;
  invoice_number?: string | null;
  lot?: string | null;
  material_id: string;
  material_type: MaterialType;
  payment_method: PaymentMethod;
  purchase_date: string;
  quantity: number;
  receipt_date?: string | null;
  total_price: number;
  unit_price: number;
}

export type UpdateMaterialPurchasePayload = Partial<
  Omit<CreateMaterialPurchasePayload, "material_id" | "material_type">
>;

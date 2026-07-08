import { z } from "zod";

import { ResourceResponse } from "@/interfaces/authResponse";
import { PaginatedResponse } from "@/interfaces/paginatedResponse";
import { Month } from "@/lib/enums";
import { ListParams } from "@/lib/listQuery";
import { billResponseSchema } from "@/lib/responseSchemas";

export type Bill = z.infer<typeof billResponseSchema>;

export type ListBillsResponse = PaginatedResponse<Bill>;

export type BillResourceResponse = ResourceResponse<Bill>;

export type ListBillsParams = Pick<ListParams, "page" | "perPage"> & {
  is_recurrent?: boolean;
  reference_month?: Month;
  reference_year?: number;
};

export interface CreateBillPayload {
  description?: string | null;
  due_date: string;
  is_recurrent: boolean;
  name: string;
  reference_month: Month;
  reference_year: number;
  value: number;
}

export interface UpdateBillPayload {
  description?: string | null;
  due_date?: string;
  is_recurrent?: boolean;
  name?: string;
  reference_month?: Month;
  reference_year?: number;
  value?: number;
}

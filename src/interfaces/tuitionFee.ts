import { z } from "zod";

import { ResourceResponse } from "@/interfaces/authResponse";
import { PaginatedResponse } from "@/interfaces/paginatedResponse";
import { ListParams } from "@/lib/listQuery";
import { tuitionFeeResponseSchema } from "@/lib/responseSchemas";

export type TuitionFee = z.infer<typeof tuitionFeeResponseSchema>;

export type ListTuitionFeesResponse = PaginatedResponse<TuitionFee>;

export type TuitionFeeResourceResponse = ResourceResponse<TuitionFee>;

export type ListTuitionFeesParams = Pick<ListParams, "page" | "perPage"> & {
  status?: "paid" | "unpaid";
};

export interface CreateTuitionFeePayload {
  enrollment_id: string;
}

export interface UpdateTuitionFeePayload {
  is_paid: boolean;
}

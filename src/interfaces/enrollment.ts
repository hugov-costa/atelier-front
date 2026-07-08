import { z } from "zod";

import { ResourceResponse } from "@/interfaces/authResponse";
import { PaginatedResponse } from "@/interfaces/paginatedResponse";
import { ListParams } from "@/lib/listQuery";
import { enrollmentResponseSchema } from "@/lib/responseSchemas";

export type Enrollment = z.infer<typeof enrollmentResponseSchema>;

export type ListEnrollmentsResponse = PaginatedResponse<Enrollment>;

export type EnrollmentResourceResponse = ResourceResponse<Enrollment>;

export type ListEnrollmentsParams = Pick<ListParams, "page" | "perPage"> & {
  annual_fee_is_paid?: boolean;
  user_id?: string;
};

export interface CreateEnrollmentPayload {
  annual_fee_due_date?: string | null;
  annual_fee_is_paid?: boolean;
  is_exempt_from_annual_fee?: boolean;
  is_exempt_from_piece_charges?: boolean;
  is_exempt_from_tuition_fee?: boolean;
  user_id: string;
}

export interface UpdateEnrollmentPayload {
  annual_fee_due_date?: string | null;
  annual_fee_is_paid?: boolean;
  is_exempt_from_annual_fee?: boolean;
  is_exempt_from_piece_charges?: boolean;
  is_exempt_from_tuition_fee?: boolean;
}

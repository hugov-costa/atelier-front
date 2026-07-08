import { z } from "zod";

import { ResourceResponse } from "@/interfaces/authResponse";
import { PaginatedResponse } from "@/interfaces/paginatedResponse";
import { DayOfWeek } from "@/lib/enums";
import { ListParams } from "@/lib/listQuery";
import { recurrentClassResponseSchema } from "@/lib/responseSchemas";

export type RecurrentClass = z.infer<typeof recurrentClassResponseSchema>;

export type ListRecurrentClassesResponse = PaginatedResponse<RecurrentClass>;

export type RecurrentClassResourceResponse = ResourceResponse<RecurrentClass>;

export type ListRecurrentClassesParams = Pick<ListParams, "page" | "perPage">;

export interface CreateRecurrentClassPayload {
  day_of_the_week: DayOfWeek;
  end_time: string;
  start_time: string;
  user_ids: string[];
}

export interface UpdateRecurrentClassPayload {
  day_of_the_week?: DayOfWeek;
  end_time?: string;
  start_time?: string;
  user_ids?: string[];
}

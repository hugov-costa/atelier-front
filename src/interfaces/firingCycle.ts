import { z } from "zod";

import { ResourceResponse } from "@/interfaces/authResponse";
import { PaginatedResponse } from "@/interfaces/paginatedResponse";
import { ListParams } from "@/lib/listQuery";
import { firingCycleResponseSchema } from "@/lib/responseSchemas";

export type FiringCycle = z.infer<typeof firingCycleResponseSchema>;

export type ListFiringCyclesResponse = PaginatedResponse<FiringCycle>;

export type FiringCycleResourceResponse = ResourceResponse<FiringCycle>;

export type ListFiringCyclesParams = Pick<ListParams, "page" | "perPage">;

export interface CreateFiringCyclePayload {
  cycle: number;
  duration: number;
  name: string;
  price_per_unit: number;
  temperature: number;
}

export type UpdateFiringCyclePayload = Partial<CreateFiringCyclePayload>;

import { z } from "zod";

import { ResourceResponse } from "@/interfaces/authResponse";
import { studentStatementResponseSchema } from "@/lib/responseSchemas";

export type StudentStatement = z.infer<typeof studentStatementResponseSchema>;

export type StudentStatementResourceResponse =
  ResourceResponse<StudentStatement>;

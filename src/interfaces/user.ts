import { z } from "zod";

import { userResponseSchema, userRoleSchema } from "@/lib/responseSchemas";

export type UserRole = z.infer<typeof userRoleSchema>;

export type User = z.infer<typeof userResponseSchema>;

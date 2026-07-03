import { z, ZodType } from "zod";

import { HttpError } from "@/utils/httpError";
import { HttpStatusType } from "@/types/httpStatus";

export const userRoleSchema = z.enum(["user", "admin", "master"]);

export const userResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: userRoleSchema.nullish(),
  avatar_url: z.string().nullish(),
  two_factor_enabled: z.boolean().nullish(),
  email_verified_at: z.string().nullish(),
  impersonated_by: z.string().nullish(),
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
  event: z.string(),
  auditable_type: z.string(),
  auditable_id: z.union([z.string(), z.number()]).nullish(),
  user_id: z.union([z.string(), z.number()]).nullish(),
  old_values: z.record(z.string(), z.unknown()).default({}),
  new_values: z.record(z.string(), z.unknown()).default({}),
  ip_address: z.string().nullish(),
  url: z.string().nullish(),
  created_at: z.string(),
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

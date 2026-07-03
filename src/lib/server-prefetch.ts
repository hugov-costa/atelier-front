import { AuditFilterParams } from "@/interfaces/audit";
import { User } from "@/interfaces/user";
import { ListUsersParams } from "@/interfaces/userResponse";
import {
  auditResponseSchema,
  paginatedSchema,
  parseApiResponse,
  resourceSchema,
  userResponseSchema,
} from "@/lib/responseSchemas";
import { serverApiGet } from "@/lib/server-api";
import { buildAuditQuery } from "@/services/auditService";
import { buildListUsersQuery } from "@/services/userService";

function isResourceResponse(value: unknown): value is { data: User } {
  return (
    typeof value === "object" &&
    value !== null &&
    "data" in value &&
    typeof (value as { data: unknown }).data === "object"
  );
}

export async function fetchCurrentUserOnServer(): Promise<User> {
  const response = await serverApiGet<{ data: User } | User>("/user");
  const user = isResourceResponse(response) ? response.data : response;

  return parseApiResponse(userResponseSchema, user);
}

export async function fetchUsersOnServer(params: ListUsersParams) {
  const response = await serverApiGet<unknown>(
    `/users${buildListUsersQuery(params)}`,
  );

  return parseApiResponse(paginatedSchema(userResponseSchema), response);
}

export async function fetchUserOnServer(userId: string) {
  const response = await serverApiGet<unknown>(`/users/${userId}`);

  return parseApiResponse(resourceSchema(userResponseSchema), response);
}

export async function fetchAuditsOnServer(params: AuditFilterParams) {
  const response = await serverApiGet<unknown>(
    `/users/audits${buildAuditQuery(params)}`,
  );

  return parseApiResponse(paginatedSchema(auditResponseSchema), response);
}

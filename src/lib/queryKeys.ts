import { AuditFilterParams } from "@/interfaces/audit";
import { ListUsersParams } from "@/interfaces/userResponse";

export const queryKeys = {
  currentUser: ["current-user"] as const,
  usersLists: ["users", "list"] as const,
  usersList: (params: ListUsersParams) => ["users", "list", params] as const,
  user: (userId: string) => ["users", "detail", userId] as const,
  audits: (params: AuditFilterParams) => ["audits", params] as const,
  userAudits: (userId: string, params: AuditFilterParams) =>
    ["audits", userId, params] as const,
};

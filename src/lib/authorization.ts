import { User, UserRole } from "@/interfaces/user";

export type Permission =
  | "atelier.manage"
  | "audits.view"
  | "reports.view"
  | "users.manage"
  | "users.view";

function roleOf(user: User | null): UserRole {
  return user?.role ?? "user";
}

export function can(user: User | null, permission: Permission): boolean {
  if (!user) {
    return false;
  }

  const role = roleOf(user);

  switch (permission) {
    case "atelier.manage":
    case "audits.view":
    case "reports.view":
    case "users.view":
      return role === "admin" || role === "master";
    case "users.manage":
      return role === "master";
  }
}

export function isMaster(user: User | null): boolean {
  return roleOf(user) === "master";
}

export function canViewUsers(user: User | null): boolean {
  return can(user, "users.view");
}

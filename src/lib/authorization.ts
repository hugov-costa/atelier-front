import { User, UserRole } from "@/interfaces/user";

export type Permission = "users.view" | "users.manage" | "audits.view";

function roleOf(user: User | null): UserRole {
  return user?.role ?? "user";
}

export function can(user: User | null, permission: Permission): boolean {
  if (!user) {
    return false;
  }

  const role = roleOf(user);

  switch (permission) {
    case "users.view":
    case "audits.view":
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

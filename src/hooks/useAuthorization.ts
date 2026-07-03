"use client";

import { useUser } from "@/contexts/user-context";
import { can, canViewUsers, isMaster, Permission } from "@/lib/authorization";

export function useAuthorization() {
  const { user } = useUser();

  return {
    user,
    isMaster: isMaster(user),
    canViewUsers: canViewUsers(user),
    can: (permission: Permission) => can(user, permission),
  };
}

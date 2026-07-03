"use client";

import { ReactNode } from "react";

import { useAuthorization } from "@/hooks/useAuthorization";
import { Permission } from "@/lib/authorization";

interface CanProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export function Can({ permission, children, fallback = null }: CanProps) {
  const { can } = useAuthorization();

  return <>{can(permission) ? children : fallback}</>;
}

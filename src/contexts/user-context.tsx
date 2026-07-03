"use client";

import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { User } from "@/interfaces/user";

interface UserContextValue {
  user: User | null;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

interface UserProviderProps {
  children: ReactNode;
  initialUser?: User | null;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({
  children,
  initialUser = null,
}: UserProviderProps) {
  const [user, setUserState] = useState<User | null>(initialUser);

  const setUser = useCallback((nextUser: User | null) => {
    setUserState(nextUser);
  }, []);

  const clearUser = useCallback(() => {
    setUserState(null);
  }, []);

  const value = useMemo<UserContextValue>(
    () => ({ user, setUser, clearUser }),
    [user, setUser, clearUser],
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser(): UserContextValue {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser deve ser utilizado dentro de um UserProvider.");
  }

  return context;
}

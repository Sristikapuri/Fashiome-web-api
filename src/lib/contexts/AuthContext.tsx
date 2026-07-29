"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type AuthUser = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  gender: "male" | "female" | "other";
  age: number;
  profileImage?: string;
  role?: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  clearUser: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({
  children,
  initialUser,
}: {
  children: ReactNode;
  initialUser: AuthUser | null;
}) {
  const [user, setUser] = useState<AuthUser | null>(initialUser);
  const [prevInitialUser, setPrevInitialUser] = useState<AuthUser | null>(initialUser);

  if (initialUser !== prevInitialUser) {
    setPrevInitialUser(initialUser);
    if (initialUser) {
      setUser(initialUser);
    }
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      setUser,
      clearUser: () => setUser(null),
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}

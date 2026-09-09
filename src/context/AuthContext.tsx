import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { api } from "@/lib/api";

type StaffUser = { id: string; ign: string; name: string; email: string; role: string };

type AuthValue = {
  user: StaffUser | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<StaffUser>;
  logout: () => Promise<void>;
  isStaff: boolean;
};

const AuthContext = createContext<AuthValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<StaffUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    api.get<{ user: StaffUser }>("/auth/me")
      .then((data) => active && setUser(data.user))
      .catch(() => active && setUser(null))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  const login = useCallback(async (identifier: string, password: string) => {
    const { user: signedIn } = await api.post<{ user: StaffUser }>("/auth/login", { identifier, password });
    // The console is staff-only; a valid player account is still not welcome here.
    if (signedIn.role !== "admin") {
      await api.post("/auth/logout").catch(() => undefined);
      throw new Error("This account does not have SCA staff access.");
    }
    setUser(signedIn);
    return signedIn;
  }, []);

  const logout = useCallback(async () => {
    try { await api.post("/auth/logout"); } finally { setUser(null); }
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, logout, isStaff: user?.role === "admin" }),
    [user, loading, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}

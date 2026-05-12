/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "../types";
import { storageGet, storageSet } from "../utils/storage";
import { DEMO_USER } from "../data/mockData";

type AuthState = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (params: {
    name: string;
    email: string;
    phone?: string;
    password: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
};

const LS_USERS = "gp_users_v1";
const LS_SESSION = "gp_session_v1";

const AuthContext = createContext<AuthState | null>(null);

function loadUsers(): User[] {
  const stored = storageGet<User[]>(LS_USERS);
  if (stored?.length) return stored;
  storageSet(LS_USERS, [DEMO_USER]);
  return [DEMO_USER];
}

export function AuthProvider(props: { children: ReactNode }) {
  const { children } = props;
  const [user, setUser] = useState<User | null>(() =>
    storageGet<User>(LS_SESSION),
  );

  useEffect(() => {
    loadUsers();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const users = loadUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    );
    if (!found) return false;
    setUser(found);
    storageSet(LS_SESSION, found);
    return true;
  }, []);

  const register = useCallback(
    async (params: { name: string; email: string; phone?: string; password: string }) => {
      const users = loadUsers();
      if (users.some((u) => u.email.toLowerCase() === params.email.toLowerCase())) {
        return { ok: false, error: "Este email já está cadastrado." };
      }
      const newUser: User = {
        id: `user_${crypto.randomUUID()}`,
        name: params.name,
        email: params.email,
        phone: params.phone ?? "",
        password: params.password,
        createdAt: new Date().toISOString(),
      };
      const next = [newUser, ...users];
      storageSet(LS_USERS, next);
      return { ok: true };
    },
    [],
  );

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem(LS_SESSION);
  }, []);

  const value = useMemo<AuthState>(
    () => ({ user, login, register, logout }),
    [user, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

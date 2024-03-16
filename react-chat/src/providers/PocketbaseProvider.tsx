import { createContext, useContext, useCallback, useState, useEffect, useMemo, ReactNode } from "react";
import { pb as PocketBase } from "@/lib/pocketbase";
import { useInterval } from "usehooks-ts";
import { JwtPayload, jwtDecode } from "jwt-decode";
import ms from "ms";

const fiveMinutesInMs = ms("5 minutes");
const twoMinutesInMs = ms("2 minutes");

type PocketContextType = {
  register: (email: string, password: string) => Promise<any>;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  user: any;
  token: string;
  pb: typeof PocketBase;
};

const PocketContext = createContext<PocketContextType | undefined>(undefined);

export const PocketProvider = ({ children }: { children: ReactNode }) => {
  const pb = useMemo(() => PocketBase, []);

  const [token, setToken] = useState(pb.authStore.token);
  const [user, setUser] = useState(pb.authStore.model);

  useEffect(() => {
    return pb.authStore.onChange((token, model) => {
      setToken(token);
      setUser(model);
    });
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    return await pb.collection("users").create({ email, password, passwordConfirm: password });
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    return await pb.collection("users").authWithPassword(email, password);
  }, []);

  const logout = useCallback(() => {
    pb.authStore.clear();
  }, []);

  const refreshSession = useCallback(async () => {
    if (!pb.authStore.isValid) return;
    const decoded = jwtDecode<JwtPayload>(token);
    const tokenExpiration = decoded.exp;
    const expirationWithBuffer = decoded.exp ? (decoded.exp + fiveMinutesInMs) / 1000 : 0;
    if (tokenExpiration !== undefined && tokenExpiration < expirationWithBuffer) {
      await pb.collection("users").authRefresh();
    }
  }, [token]);

  useInterval(refreshSession, token ? twoMinutesInMs : null);

  return <PocketContext.Provider value={{ register, login, logout, user, token, pb }}>{children}</PocketContext.Provider>;
};

export const usePocket = () => {
  const context = useContext(PocketContext);
  if (!context) {
    throw new Error("usePocket must be used within a PocketProvider");
  }
  return context;
};

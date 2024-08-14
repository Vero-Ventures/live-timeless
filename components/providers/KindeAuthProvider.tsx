import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { KindeSDK } from "@kinde-oss/react-native-sdk-0-7x";

type AuthContextType =
  | { client: KindeSDK; status: "success" }
  | { client: null; status: "loading" }
  | { client: null; status: "error" };

const defaultAuthContext: AuthContextType = {
  client: null,
  status: "loading",
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export function KindeAuthProvider({ children }: { children: ReactNode }) {
  const [authContext, setAuthContext] =
    useState<AuthContextType>(defaultAuthContext);

  useEffect(() => {
    const initializeClient = async () => {
      try {
        const kindeClient = new KindeSDK(
          process.env.EXPO_PUBLIC_KINDE_ISSUER_URL!,
          process.env.EXPO_PUBLIC_KINDE_POST_CALLBACK_URL!,
          process.env.EXPO_PUBLIC_KINDE_CLIENT_ID!,
          process.env.EXPO_PUBLIC_KINDE_POST_LOGOUT_REDIRECT_URL!
        );
        setAuthContext({ client: kindeClient, status: "success" });
      } catch (error) {
        console.error("Error initializing Kinde client:", error);
        setAuthContext({ client: null, status: "error" });
      }
    };

    initializeClient();
  }, []);

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth must be used within a KindeAuthProvider");
  }
  return context;
}

import { useKindeAuth as useKindeExpoAuth } from "@kinde/expo";
import { UserProfile } from "@kinde/expo/dist/types";

import { createContext, useContext, useEffect, useState } from "react";

type KindeUserProfileContextType = {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
};
const kindeUserProfileContext = createContext<KindeUserProfileContextType>({
  user: null,
  setUser: () => {},
});

export default function KindeUserProfileProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const { getUserProfile } = useKindeExpoAuth();

  useEffect(() => {
    async function fetchUser() {
      const userProfile = await getUserProfile();
      if (!userProfile) return;
      setUser(userProfile);
    }
    fetchUser();
  }, [getUserProfile]);

  return (
    <kindeUserProfileContext.Provider
      value={{
        user: user,
        setUser,
      }}
    >
      {children}
    </kindeUserProfileContext.Provider>
  );
}

export function useUserProfile() {
  const context = useContext(kindeUserProfileContext);
  if (context === undefined) {
    throw new Error("useKindeAuth must be used within a KindeAuthProvider");
  }
  return context;
}

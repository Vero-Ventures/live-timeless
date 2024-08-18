import { useKindeAuth } from "@kinde/expo";
import { UserProfile } from "@kinde/expo/dist/types";

import { useEffect, useState } from "react";

export function useGetUserProfile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const { getUserProfile } = useKindeAuth();

  useEffect(() => {
    async function fetchUser() {
      const userProfile = await getUserProfile();
      if (!userProfile) return;
      setUser(userProfile);
    }
    fetchUser();
  }, [getUserProfile]);

  return { user };
}

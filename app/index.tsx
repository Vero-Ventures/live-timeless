import { Redirect } from "expo-router";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import Onboarding from "./onboarding";
import { api } from "~/convex/_generated/api";

export default function SignInPage() {
  return (
    <>
      <Unauthenticated>
        <Onboarding />
      </Unauthenticated>
      <Authenticated>
        <CrossRoad />
      </Authenticated>
    </>
  );
}

function CrossRoad() {
  const user = useQuery(api.users.currentUser);
  if (!user) {
    return null;
  }
  return <Redirect href={user.hasOnboarded ? "/goals" : "/onboarding/name"} />;
}

import { Redirect } from "expo-router";
import { Authenticated, Unauthenticated } from "convex/react";
import Onboarding from "./onboarding";

export default function SignInPage() {
  return (
    <>
      <Unauthenticated>
        <Onboarding />
      </Unauthenticated>
      <Authenticated>
        <Redirect href="/goals" />
      </Authenticated>
    </>
  );
}

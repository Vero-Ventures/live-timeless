import { type JWTDecoded, jwtDecoder } from "@kinde/jwt-decoder";

import { Redirect } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useKindeAuth } from "@kinde/expo";
import { api } from "~/convex/_generated/api";
import { useMutation } from "convex/react";
import { useUserProfile } from "~/providers/kindeUserProfileProvider";

export default function HomePage() {
  const { isAuthenticated, register, login } = useKindeAuth();
  const { user: userProfile } = useUserProfile();
  const createUser = useMutation(api.users.createUser);

  if (isAuthenticated && userProfile) {
    return <Redirect href="/home" />;
  }

  const handleSignUp = async () => {
    const token = await register({ redirectURL: "/home" });
    if (token.success) {
      const decodedToken = jwtDecoder<
        JWTDecoded & {
          sub: string;
          email: string;
          family_name: string;
          given_name: string;
        }
      >(token.idToken);
      if (!decodedToken) {
        console.error("Failed to decode token");
        return;
      }

      await createUser({
        kindeId: decodedToken.sub,
        firstName: decodedToken.given_name,
        lastName: decodedToken.family_name,
        email: decodedToken.email,
      });
    }
  };

  const handleSignIn = async () => {
    await login({ redirectURL: "/home" });
  };

  return (
    <SafeAreaView className="h-full bg-background">
      <View className="h-full p-4 gap-4">
        <View className="h-80">
          <Text className="text-xl font-bold">Live Timeless</Text>
        </View>
        <View className="">
          <Button onPress={handleSignIn}>
            <Text>Sign In</Text>
          </Button>
        </View>
        <View>
          <Button variant="secondary" onPress={handleSignUp}>
            <Text>Sign Up</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

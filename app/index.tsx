import { type JWTDecoded, jwtDecoder } from "@kinde/jwt-decoder";

import { Link, Redirect } from "expo-router";
import { Image, View } from "react-native";
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
    <SafeAreaView
      style={{
        height: "100%",
        backgroundColor: "#082139",
      }}
    >
      <View className="h-full gap-4 p-4">
        <View className="h-80">
          <Image
            source={require("~/assets/images/logo.png")}
            className="mx-auto h-fit w-fit"
          />
        </View>
        <View className="">
          <Button variant="default" size="lg" onPress={handleSignIn}>
            <Text>Login</Text>
          </Button>
        </View>
        <View>
          <Button variant="secondary" size="lg" onPress={handleSignUp}>
            <Text>Register</Text>
          </Button>
        </View>
        <View className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-row gap-4">
          <Link href="/privacy-policy">
            <Text className="text-sm text-gray-500">Privacy Policy</Text>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

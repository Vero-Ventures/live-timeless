import { Redirect } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useKindeAuth } from "@kinde/expo";
import { api } from "~/convex/_generated/api";
import { useMutation } from "convex/react";

export default function HomePage() {
  const { isAuthenticated, register, login, getUserProfile } = useKindeAuth();
  const createUser = useMutation(api.users.createUser);

  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }

  const handleSignUp = async () => {
    const token = await register({ redirectURL: "/home" });
    if (token.success) {
      const userProfile = await getUserProfile();
      if (!userProfile) return;

      await createUser({
        kindeId: userProfile.id,
        firstName: userProfile.givenName,
        lastName: userProfile.familyName,
        email: userProfile.email,
      });
    }
  };

  const handleSignIn = async () => {
    await login({ redirectURL: "/home" });
  };

  return (
    <SafeAreaView className="h-full">
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

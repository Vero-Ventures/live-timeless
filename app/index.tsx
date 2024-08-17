import { Redirect, useRouter } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useKindeAuth } from "@kinde/expo";

export default function HomePage() {
  const { isAuthenticated, register, login } = useKindeAuth();
  const router = useRouter();

  if (isAuthenticated) {
    return <Redirect href="/home" />;
  }

  const handleSignUp = async () => {
    const token = await register({});
    if (token) {
      router.replace("/home");
    }
  };

  const handleSignIn = async () => {
    const token = await login({});
    if (token) {
      router.replace("/home");
    }
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

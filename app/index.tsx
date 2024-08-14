import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { client } from "~/lib/kinde";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const checkAuthenticate = async () => {
      if (await client.isAuthenticated) {
        router.replace("/home");
      }
    };
    checkAuthenticate();
  }, [router]);

  const handleSignUp = async () => {
    const token = await client.register();
    if (token) {
      router.replace("/");
    }
  };

  const handleSignIn = async () => {
    const token = await client.login();
    if (token) {
      router.replace("/home");
    }
  };

  return (
    <SafeAreaView className="h-full">
      <View className="h-full p-4">
        <Text className="text-foreground">Testing</Text>
        <View>
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

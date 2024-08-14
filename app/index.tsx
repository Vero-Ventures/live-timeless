import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
// import { client } from "~/lib/kinde";
import { useRouter } from "expo-router";
import { useAuth } from "~/components/providers/KindeAuthProvider";

export default async function HomePage() {
  const router = useRouter();
  const { client } = useAuth();
  if (!client) {
    return null;
  }

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
          <Button onPress={handleSignUp}>
            <Text>Sign Up</Text>
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

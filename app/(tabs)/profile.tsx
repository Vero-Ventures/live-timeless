import { useRouter } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import {  useKindeAuth } from "~/lib/kinde";

export default function Profile() {
  const router = useRouter();
  const { logout, user } = useKindeAuth()

  if (!user) {
    router.replace("/")
  }

  return (
    <SafeAreaView className="h-full">
      <View className="flex-row gap-4 text-xl">
        <Text>{user?.given_name}</Text>
         <Text>{user?.family_name}</Text>
      </View>
      <View>
        <Text>Email: {user?.email}</Text>
      </View>
      <Button onPress={logout}>
        <Text>Logout</Text>
      </Button>
    </SafeAreaView>
  );
}

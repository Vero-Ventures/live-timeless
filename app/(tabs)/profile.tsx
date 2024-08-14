import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { client } from "~/lib/kinde";

export default function Profile() {
  const router = useRouter();

  const handleLogout = async () => {
    const loggedOut = await client.logout(true);
    if (loggedOut) {
      router.replace("/");
    }
  };

  return (
    <SafeAreaView className="h-full">
      <Text>Profile</Text>
      <Button onPress={handleLogout}>
        <Text>Logout</Text>
      </Button>
    </SafeAreaView>
  );
}

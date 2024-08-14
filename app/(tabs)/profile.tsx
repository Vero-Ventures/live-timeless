import { View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { client } from "~/lib/kinde";

export default function Profile() {
  const handleLogout = async () => {
    const loggedOut = await client.logout();
    if (loggedOut) {
      // User was logged out
    }
  };

  return (
    <View className="h-full">
      <Text>Profile</Text>
      <Button onPress={handleLogout}>
        <Text>Logout</Text>
      </Button>
    </View>
  );
}

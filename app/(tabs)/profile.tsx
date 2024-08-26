import { useKindeAuth } from "@kinde/expo";

import { useRouter } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useUserProfile } from "~/providers/kindeUserProfileProvider";

export default function Profile() {
  const { logout } = useKindeAuth();
  const { user, setUser } = useUserProfile();
  const router = useRouter();

  const handleLogout = async () => {
    const result = await logout({ revokeToken: true });
    if (result.success) {
      setUser(null);
      router.replace("/");
    } else {
      console.error("Failed to logout");
    }
  };

  return (
    <SafeAreaView className="h-full">
      <View className="gap-8 p-4">
        <View className="gap-4">
          <View className="mx-auto">
            <Avatar className="h-32 w-32" alt={`${user?.givenName}'s Avatar`}>
              <AvatarImage
                source={{
                  uri:
                    user?.picture ??
                    "https://avatars.githubusercontent.com/scottchen98.png",
                }}
              />
            </Avatar>
          </View>
          <Text className="text-center text-xl font-bold">
            {user?.givenName} {user?.familyName}
          </Text>
          <Text className="text-center">{user?.email}</Text>
        </View>
        <Button size="lg" onPress={handleLogout}>
          <Text>Logout</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

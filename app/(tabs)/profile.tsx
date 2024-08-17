import { useKindeAuth } from "@kinde/expo";
import { UserProfile } from "@kinde/expo/dist/types";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const { logout, getUserProfile } = useKindeAuth();

  useEffect(() => {
    async function fetchUser() {
      const userProfile = await getUserProfile();
      setUser(userProfile);
    }
    fetchUser();
  }, [getUserProfile]);

  const handleLogout = async () => {
    await logout({ revokeToken: true });
  };

  return (
    <SafeAreaView className="h-full">
      <View className="p-4 gap-8">
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
          <Text className="font-bold text-xl text-center">
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

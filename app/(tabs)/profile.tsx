import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useKindeAuth } from "~/lib/kinde";

export default function Profile() {
  const { logout, user } = useKindeAuth();

  return (
    <SafeAreaView className="h-full">
      <View className="p-4 gap-8">
        <View className="gap-4">
          <View className="mx-auto">
            <Avatar className="h-32 w-32" alt={`${user?.given_name}'s Avatar`}>
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
            {user?.given_name} {user?.family_name}
          </Text>
          <Text className="text-center">{user?.email}</Text>
        </View>
        <Button size="lg" onPress={logout}>
          <Text>Logout</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

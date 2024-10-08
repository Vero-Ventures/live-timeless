import { useQuery } from "convex/react";
import { Link, Redirect, router } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Loader2 } from "lucide-react-native";
import { useAuthActions } from "@convex-dev/auth/dist/react";
import PrivacyPolicyButton from "~/components/privacy-policy-button";

export default function Profile() {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.currentUser);

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "#082139" }}>
      <AuthLoading>
        <View className="h-full items-center justify-center">
          <Loader2 className="size-32 animate-spin" />
        </View>
      </AuthLoading>
      <Unauthenticated>
        <Redirect href="/" />
      </Unauthenticated>
      <Authenticated>
        <View className="h-full gap-8 p-4">
          <View className="gap-4">
            <View className="mx-auto">
              <Avatar
                className="h-32 w-32 border border-input"
                alt={`${user?.name}'s Avatar`}
              >
                <AvatarImage
                  source={{
                    uri: user?.image ?? "https://github.com/ynvtlmr.png",
                  }}
                />
              </Avatar>
            </View>
            <Text className="text-center text-xl font-bold">{user?.name}</Text>
            <Text className="text-center">{user?.email}</Text>
          </View>
          <Link href="/profile/edit" asChild>
            <Button size="lg">
              <Text>Edit Profile</Text>
            </Button>
          </Link>
          <Button
            size="lg"
            onPress={async () => {
              await signOut();
            }}
          >
            <Text>Logout</Text>
          </Button>
        </View>
      </Authenticated>
      <View className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-row gap-4">
        <PrivacyPolicyButton />
      </View>
    </SafeAreaView>
  );
}

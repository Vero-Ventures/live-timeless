import { useMutation, useQuery } from "convex/react";
import { Link, Redirect } from "expo-router";
import { Alert, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Loader2 } from "lucide-react-native";
import { useAuthActions } from "@convex-dev/auth/dist/react";
import PrivacyPolicyButton from "~/components/privacy-policy-button";
import { User2 } from "~/lib/icons/User2";
import { Separator } from "~/components/ui/separator";

export default function Profile() {
  const { signOut } = useAuthActions();
  const user = useQuery(api.users.currentUser);
  const deleteCurrentUser = useMutation(api.users.deleteCurrentUser);

  const handleDeleteAccount = () => {
    Alert.alert(
      `Are you sure you want to delete your account?`,
      "This action cannot be undone.",
      [
        {
          text: "Yes",
          onPress: async () => {
            await signOut();
            if (!user) return;
            await deleteCurrentUser({ userId: user._id });
          },
          style: "destructive",
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "#082139" }}>
      <AuthLoading>
        <View className="h-full items-center justify-center">
          <Loader2 className="size-32 animate-spin" />
        </View>
      </AuthLoading>
      <Unauthenticated>
        <Redirect href="/onboarding" />
      </Unauthenticated>
      <Authenticated>
        <View className="h-full gap-8 p-4">
          <View className="gap-4">
            <View className="mx-auto">
              {!!user?.image ? (
                <Avatar className="h-32 w-32" alt={`${user?.name}'s Avatar`}>
                  <AvatarImage
                    source={{
                      uri: user.image,
                    }}
                  />
                </Avatar>
              ) : (
                <View className="h-32 w-32 items-center justify-center rounded-full bg-input">
                  <User2 size={50} className="stroke-foreground" />
                </View>
              )}
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
            variant="outline"
            size="lg"
            onPress={async () => {
              await signOut();
            }}
          >
            <Text>Sign Out</Text>
          </Button>
          <Separator />
          <Button variant="destructive" size="lg" onPress={handleDeleteAccount}>
            <Text>Delete Account</Text>
          </Button>
        </View>
      </Authenticated>
      <View className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-row gap-4">
        <PrivacyPolicyButton />
      </View>
    </SafeAreaView>
  );
}

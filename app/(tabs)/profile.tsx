import { Link } from "expo-router";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";

export default function Profile() {
  return (
    <SafeAreaView>
      <Text>USER PROFILE</Text>
    </SafeAreaView>
  );
  // return (
  //   <SafeAreaView style={{ height: "100%", backgroundColor: "#082139" }}>
  //     <View className="h-full gap-8 p-4">
  //       <View className="gap-4">
  //         <View className="mx-auto">
  //           <Avatar className="h-32 w-32" alt={`${user?.givenName}'s Avatar`}>
  //             <AvatarImage
  //               source={{
  //                 uri:
  //                   user?.picture ??
  //                   "https://avatars.githubusercontent.com/scottchen98.png",
  //               }}
  //             />
  //           </Avatar>
  //         </View>
  //         <Text className="text-center text-xl font-bold">
  //           {user?.givenName} {user?.familyName}
  //         </Text>
  //         <Text className="text-center">{user?.email}</Text>
  //       </View>
  //       <Button size="lg" onPress={handleLogout}>
  //         <Text>Logout</Text>
  //       </Button>
  //       <View>
  //         <Link href="/privacy-policy">
  //           <Text>Privacy Policy</Text>
  //         </Link>
  //       </View>
  //     </View>
  //   </SafeAreaView>
  // );
}

import { Link, Redirect } from "expo-router";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
// import { api } from "~/convex/_generated/api";
// import { useMutation } from "convex/react";;

export default function HomePage() {
  // const createUser = useMutation(api.users.createUser);

  return <Redirect href="/home" />;

  // return (
  //   <SafeAreaView
  //     style={{
  //       height: "100%",
  //       backgroundColor: "#082139",
  //     }}
  //   >
  //     <View className="h-full gap-4 p-4">
  //       <View className="h-80">
  //         <Image
  //           source={require("~/assets/images/logo.png")}
  //           className="mx-auto h-fit w-fit"
  //         />
  //       </View>
  //       <View className="">
  //         <Button variant="default" size="lg" onPress={handleSignIn}>
  //           <Text>Login</Text>
  //         </Button>
  //       </View>
  //       <View>
  //         <Button variant="secondary" size="lg" onPress={handleSignUp}>
  //           <Text>Register</Text>
  //         </Button>
  //       </View>
  //       <View className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-row gap-4">
  //         <Link href="/privacy-policy">
  //           <Text className="text-sm text-gray-500">Privacy Policy</Text>
  //         </Link>
  //       </View>
  //     </View>
  //   </SafeAreaView>
  // );
}

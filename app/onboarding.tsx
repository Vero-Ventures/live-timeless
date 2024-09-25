import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { View, ImageBackground, Image } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { fontFamily } from "~/lib/font";
import { useUserStore } from "~/stores/user-store";

export default function Onboarding() {
  const router = useRouter();
  const toggleHasOnboarded = useUserStore((state) => state.toggleHasOnboarded);

  const handlePress = () => {
    toggleHasOnboarded();
    router.replace("/home");
  };

  return (
    <ImageBackground
      source={require("~/assets/images/onboarding.jpg")}
      className="flex-1 justify-between gap-10"
      resizeMode="cover"
    >
      <SafeAreaView
        style={{
          height: "100%",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Image
          source={require("~/assets/images/logo.png")}
          className="mx-auto mt-6 h-[40px] w-[168px]"
        />

        <View className="gap-10">
          <View>
            <Text
              className="text-center text-3xl"
              style={{
                fontFamily: fontFamily.openSans.bold,
              }}
            >
              Transform performance
            </Text>
            <Text
              className="text-center text-3xl"
              style={{
                fontFamily: fontFamily.openSans.regular,
              }}
            >
              within your organization
            </Text>
          </View>
          <Button className="mx-5 mb-7" size="lg" onPress={handlePress}>
            <Text>Continue</Text>
          </Button>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

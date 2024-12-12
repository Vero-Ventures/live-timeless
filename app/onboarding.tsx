import { SafeAreaView } from "react-native-safe-area-context";
import { View, ImageBackground, Image } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { router, SplashScreen } from "expo-router";
import { useEffect } from "react";

export default function Onboarding() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);
  return (
    <ImageBackground
      source={{ uri: "onboarding" }}
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
            <Text className="text-center text-3xl font-bold">
              Transform performance
            </Text>
            <Text className="text-center text-3xl">
              within your organization
            </Text>
          </View>
          <Button
            className="mx-5 mb-7"
            size="lg"
            onPress={() => router.replace("/sign-in")}
          >
            <Text>Continue</Text>
          </Button>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

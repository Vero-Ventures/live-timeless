import { Redirect } from "expo-router";
import { ActivityIndicator, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import Onboarding from "./onboarding";

export default function SignInPage() {
  return (
    <>
      <AuthLoading>
        <SafeAreaView
          style={{
            height: "100%",
            backgroundColor: "#082139",
          }}
        >
          <View className="flex-1 items-center justify-center gap-6">
            <Image
              className="h-[40px] w-[168px]"
              source={require("~/assets/images/logo.png")}
            />
            <ActivityIndicator size="large" />
          </View>
        </SafeAreaView>
      </AuthLoading>
      <Unauthenticated>
        <Onboarding />
      </Unauthenticated>
      <Authenticated>
        <Redirect href="/home" />
      </Authenticated>
    </>
  );
}

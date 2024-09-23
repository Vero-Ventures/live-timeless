import { Link, Redirect, router } from "expo-router";
import { ActivityIndicator, Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { fontFamily } from "~/lib/font";
import { Input } from "~/components/ui/input";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Loader2 } from "~/lib/icons/Loader2";

export default function SignInPage() {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"signIn" | { email: string }>("signIn");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  return (
    <SafeAreaView
      style={{
        height: "100%",
        backgroundColor: "#082139",
      }}
    >
      <AuthLoading>
        <View className="flex-1 items-center justify-center gap-6">
          <Image
            source={require("~/assets/images/logo.png")}
            className="h-fit w-fit"
          />
          <ActivityIndicator size="large" />
        </View>
      </AuthLoading>
      <Unauthenticated>
        <View className="h-full gap-4 p-4">
          <View className="h-80">
            <Image
              source={require("~/assets/images/logo.png")}
              className="mx-auto h-fit w-fit"
            />
          </View>
          <View className="gap-4">
            {step === "signIn" ? (
              <>
                <Text
                  className="text-center text-2xl"
                  style={{ fontFamily: fontFamily.openSans.bold }}
                >
                  Sign In with Email
                </Text>
                <Input
                  keyboardType="email-address"
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  autoComplete="email"
                />
                <Button
                  variant="default"
                  size="lg"
                  onPress={async () => {
                    try {
                      await signIn("resend-otp", { email });
                      setStep({ email });
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                >
                  <Text>Send Code</Text>
                </Button>
              </>
            ) : (
              <>
                <Text
                  className="text-center text-2xl"
                  style={{ fontFamily: fontFamily.openSans.bold }}
                >
                  Verify Code
                </Text>
                <Input
                  keyboardType="number-pad"
                  placeholder="Code"
                  value={code}
                  onChangeText={setCode}
                  autoComplete="one-time-code"
                />
                <Button
                  variant="default"
                  size="lg"
                  onPress={async () => {
                    try {
                      await signIn("resend-otp", { email, code });
                      router.replace("/home");
                    } catch (error) {
                      console.log(error);
                    }
                  }}
                >
                  <Text>Continue</Text>
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onPress={() => {
                    setStep("signIn");
                    setEmail("");
                    setCode("");
                  }}
                >
                  <Text>Cancel</Text>
                </Button>
              </>
            )}
          </View>
          <View className="absolute bottom-4 left-1/2 flex -translate-x-1/2 flex-row gap-4">
            <Link href="/privacy-policy">
              <Text className="text-sm text-gray-500">Privacy Policy</Text>
            </Link>
          </View>
        </View>
      </Unauthenticated>
      <Authenticated>
        <Redirect href="/home" />
      </Authenticated>
    </SafeAreaView>
  );
}

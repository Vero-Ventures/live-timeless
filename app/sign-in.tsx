import { useAuthActions } from "@convex-dev/auth/dist/react";
import { Link, router } from "expo-router";
import { useState } from "react";
import { View, Image } from "react-native";
import { Text } from "~/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { fontFamily } from "~/lib/font";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
export default function SignIn() {
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
      <KeyboardAwareScrollView className="h-full">
        <View className="h-full gap-4">
          <View className="h-80">
            <Image
              source={require("~/assets/images/logo.png")}
              className="mx-auto mt-6 h-[40px] w-[168px]"
            />
          </View>
          <View className="gap-4 p-4">
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
        </View>
      </KeyboardAwareScrollView>
      <View className="absolute bottom-6 left-1/2 flex -translate-x-1/2 flex-row gap-4">
        <Link href="/privacy-policy">
          <Text className="text-sm text-blue-500">Privacy Policy</Text>
        </Link>
      </View>
    </SafeAreaView>
  );
}

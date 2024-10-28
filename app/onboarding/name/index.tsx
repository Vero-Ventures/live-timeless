import { useMutation } from "convex/react";
import { router, SplashScreen } from "expo-router";
import { AlertCircle } from "lucide-react-native";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import FormSubmitButton from "~/components/form-submit-button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";

export default function OnboardingNamePage() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#082139",
        justifyContent: "center",
      }}
    >
      <KeyboardAwareScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
        }}
      >
        <Text className="mb-6 text-center text-2xl font-bold">
          What is your name?
        </Text>
        <OnboardingProfileForm />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

function OnboardingProfileForm() {
  const updateUserName = useMutation(api.users.updateUserName);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  const handleSaveName = async () => {
    try {
      setIsPending(true);
      if (name.trim().length < 2) {
        throw new Error("Your name is too short");
      }
      const nameRegex = /^[a-zA-Z]+$/;
      if (nameRegex.test(name.trim())) {
        throw new Error("Your name can only contain letters");
      }
      await updateUserName({ name });
      router.replace("/onboarding/profile");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsPending(false);
    }
  };
  return (
    <View className="gap-6 px-4">
      {!!error && (
        <Alert icon={AlertCircle} variant="destructive" className="max-w-xl">
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <View className="gap-2">
        <Input
          inputMode="text"
          placeholder="John Doe"
          value={name}
          onChangeText={setName}
        />
      </View>
      <FormSubmitButton isPending={isPending} onPress={handleSaveName}>
        Continue
      </FormSubmitButton>
    </View>
  );
}

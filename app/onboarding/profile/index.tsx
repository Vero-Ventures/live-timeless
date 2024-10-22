import { Link, router } from "expo-router";
import { AlertCircle, CalendarDays } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePicker from "react-native-modal-datetime-picker";
import { SafeAreaView } from "react-native-safe-area-context";
import FormSubmitButton from "~/components/form-submit-button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Text } from "~/components/ui/text";
import { formatDate } from "~/lib/date";
import { fontFamily } from "~/lib/font";
import { useProfileFormStore } from "~/app/profile/edit/profile-form-store";
import { useShallow } from "zustand/react/shallow";
import { Button } from "~/components/ui/button";

export default function OnboardingProfilePage() {
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
          Tell us more about you!
        </Text>
        <OnboardingProfileForm />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}

function OnboardingProfileForm() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [dob, setDob, weight, setWeight, height, setHeight] =
    useProfileFormStore(
      useShallow((s) => [
        s.dob,
        s.setDob,
        s.weight,
        s.setWeight,
        s.height,
        s.setHeight,
      ])
    );
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setDob(date);
    hideDatePicker();
  };

  const handleSaveProfile = async () => {
    try {
      setIsPending(true);
      const profile = { dob, weight, height };
      console.log(profile);
      router.replace("/goals");
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
      <Pressable onPress={showDatePicker}>
        <View className="rounded-xl border border-input">
          <View className="flex flex-row items-center gap-4 p-5">
            <View className="rounded-xl bg-[#1E00FE] p-2">
              <CalendarDays color="#fff" />
            </View>
            <View>
              <Text
                className="text-xs text-muted-foreground"
                style={{
                  fontFamily: fontFamily.openSans.semiBold,
                  letterSpacing: 0.5,
                }}
              >
                Date of Birth
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.openSans.semiBold,
                }}
              >
                {formatDate(dob)}
              </Text>
            </View>
          </View>
          <DateTimePicker
            display="inline"
            isVisible={isDatePickerVisible}
            mode="date"
            date={dob}
            maximumDate={new Date()}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </View>
      </Pressable>
      <View className="gap-2">
        <Label nativeID="height">Height (cm)</Label>
        <Input
          placeholder="Enter your height"
          value={height}
          onChangeText={setHeight}
          keyboardType="numeric"
        />
      </View>
      <View className="gap-2">
        <Label nativeID="weight">Weight (kg)</Label>
        <Input
          placeholder="Enter your weight"
          value={weight}
          onChangeText={setWeight}
          keyboardType="numeric"
        />
      </View>
      <FormSubmitButton isPending={isPending} onPress={handleSaveProfile}>
        Continue
      </FormSubmitButton>
      <Link href="/goals" asChild>
        <Button variant="link">
          <Text>Skip for now</Text>
        </Button>
      </Link>
    </View>
  );
}

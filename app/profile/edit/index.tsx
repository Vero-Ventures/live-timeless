import { useEffect, useState } from "react";
import { Redirect, Stack, router } from "expo-router";
import { Text } from "~/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Authenticated,
  Unauthenticated,
  AuthLoading,
  useMutation,
  useQuery,
} from "convex/react";
import { Pressable, View } from "react-native";
import { AlertCircle, CalendarDays, Loader2 } from "lucide-react-native";
import { fontFamily } from "~/lib/font";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import DateTimePicker from "react-native-modal-datetime-picker";
import { useProfileFormStore } from "./profile-form-store";
import { useShallow } from "zustand/react/shallow";
import { formatDate } from "~/lib/date";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import FormSubmitButton from "~/components/form-submit-button";
import { api } from "~/convex/_generated/api";

export default function EditProfileScreen() {
  return (
    <SafeAreaView style={{ backgroundColor: "#082139", flex: 1 }}>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff",
          headerTitle: () => (
            <Text style={{ fontFamily: fontFamily.openSans.bold }}>
              Edit Profile
            </Text>
          ),
          headerBackTitleVisible: false,
        }}
      />
      <AuthLoading>
        <View className="flex-1 items-center justify-center">
          <Loader2 className="size-32 animate-spin" />
        </View>
      </AuthLoading>
      <Unauthenticated>
        <Redirect href="/" />
      </Unauthenticated>
      <Authenticated>
        <EditProfileForm />
      </Authenticated>
    </SafeAreaView>
  );
}
function EditProfileForm() {
  const user = useQuery(api.users.currentUser);
  const updateProfile = useMutation(api.users.updateProfile);
  const [
    name,
    setName,
    email,
    setEmail,
    dob,
    setDob,
    weight,
    setWeight,
    height,
    setHeight,
  ] = useProfileFormStore(
    useShallow((s) => [
      s.name,
      s.setName,
      s.email,
      s.setEmail,
      s.dob,
      s.setDob,
      s.weight,
      s.setWeight,
      s.height,
      s.setHeight,
    ])
  );
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name ?? "");
      setEmail(user.email ?? "");
      setDob(user.dob ? new Date(user.dob) : new Date());
      setWeight(user.weight?.toString() ?? "");
      setHeight(user.height?.toString() ?? "");
    }
  }, [user, setName, setEmail, setDob, setWeight, setHeight]);

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
      const profile = { name, email, dob, weight, height };
      updateProfile({
        ...profile,
        dob: dob.getTime(), // store as timestamp
        weight: weight ? parseFloat(weight) : undefined,
        height: height ? parseFloat(height) : undefined,
      });
      router.navigate("/profile");
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
        <Label nativeID="name">Name</Label>
        <Input
          inputMode="text"
          placeholder="John Doe"
          value={name}
          onChangeText={setName}
        />
      </View>
      <View className="gap-2">
        <Label nativeID="email">Email</Label>
        <Input
          inputMode="email"
          placeholder="example@email.com"
          value={email}
          onChangeText={setEmail}
        />
      </View>
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
        Save
      </FormSubmitButton>
    </View>
  );
}

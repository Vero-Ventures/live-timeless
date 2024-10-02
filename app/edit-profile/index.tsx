import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect } from "react";
import { useQuery } from "convex/react";
import { Redirect, useRouter } from "expo-router";
import { api } from "~/convex/_generated/api";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { ScrollView, View } from "react-native";
import { Loader2 } from "lucide-react-native";
import DropDownPicker from "react-native-dropdown-picker";
import InputField from "~/components/profile/input-field";
import { useEditProfile } from "~/hooks/useEditProfile";

export default function EditProfile() {
  const navigation = useNavigation();
  const {
    name,
    setName,
    email,
    setEmail,
    dobDay,
    setDobDay,
    dobMonth,
    setDobMonth,
    dobYear,
    setDobYear,
    gender,
    setGender,
    height,
    setHeight,
    weight,
    setWeight,
    open,
    setOpen,
    genderOptions,
    handleUpdateProfile,
  } = useEditProfile();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Edit Profile",
      headerStyle: { backgroundColor: "#082139" },
      headerBackTitleVisible: false,
    });
  }, [navigation]);

  return (
    <SafeAreaView style={{ backgroundColor: "#082139", flex: 1 }}>
      <AuthLoading>
        <View className="h-full items-center justify-center">
          <Loader2 className="size-32 animate-spin" />
        </View>
      </AuthLoading>
      <Unauthenticated>
        <Redirect href="/" />
      </Unauthenticated>
      <Authenticated>
        <ScrollView
          contentContainerStyle={{ padding: 3, flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        />
          <View style={{ padding: 16 }}>
            <InputField
              label="Name"
              placeholder="Name"
              value={name}
              setValue={setName}
              style={{ marginBottom: 16 }}
            />
            <InputField
              label="Email"
              placeholder="Email"
              value={email}
              setValue={setEmail}
              style={{ marginBottom: 24 }}
            />
            {/* DOB */}
            <View style={{ marginBottom: 24 }}>
              <Text style={{ color: "#a6b1c3", marginBottom: 12 }}>
                Date of Birth
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <InputField
                  placeholder="Month"
                  value={dobMonth}
                  setValue={(month) => {
                    if (
                      month === "" ||
                      (parseInt(month) >= 1 && parseInt(month) <= 12)
                    )
                      setDobMonth(month);
                  }}
                  keyboardType="numeric"
                  maxLength={2}
                  style={{
                    flex: 0,
                    width: 60,
                    marginRight: 16,
                    textAlign: "center",
                  }}
                />
                <InputField
                  placeholder="Day"
                  value={dobDay}
                  setValue={(day) => {
                    if (
                      day === "" ||
                      (parseInt(day) >= 1 && parseInt(day) <= 31)
                    )
                      setDobDay(day);
                  }}
                  keyboardType="numeric"
                  maxLength={2}
                  style={{
                    flex: 0,
                    width: 60,
                    marginRight: 16,
                    textAlign: "center",
                  }}
                />
                <InputField
                  placeholder="Year"
                  value={dobYear}
                  setValue={(year) => {
                    const currentYear = new Date().getFullYear();
                    if (
                      year === "" ||
                      (parseInt(year) >= 1 && parseInt(year) <= currentYear)
                    )
                      setDobYear(year);
                  }}
                  keyboardType="numeric"
                  maxLength={4}
                  style={{
                    flex: 0,
                    width: 100,
                    marginRight: 16,
                    textAlign: "center",
                  }}
                />
              </View>
            </View>

            {/* Gender */}
            <DropDownPicker
              open={open}
              value={gender}
              items={genderOptions}
              setOpen={setOpen}
              setValue={setGender}
              style={{
                backgroundColor: "#0e2942",
                borderColor: "#0e2942",
                height: 58,
                marginBottom: 16,
              }}
              textStyle={{
                color: "#ffffff",
              }}
              dropDownContainerStyle={{
                backgroundColor: "#0e2942",
                borderColor: "#0e2942",
              }}
              placeholder="Gender"
              placeholderStyle={{ color: "#a6b1c3" }}
            />

            {/* Height */}
            <InputField
              label="Height (cm)"
              placeholder="Height (cm)"
              value={height}
              setValue={setHeight}
              keyboardType="numeric"
              style={{ marginBottom: 16 }}
            />
            {/* Weight */}
            <InputField
              label="Weight (kg)"
              placeholder="Weight (kg)"
              value={weight}
              setValue={setWeight}
              keyboardType="numeric"
              style={{ marginBottom: 24 }}
            />
            {/* Submit */}
            <Button onPress={handleUpdateProfile} style={{ marginTop: 16 }}>
              <Text style={{ color: "#fff" }}>Save</Text>
            </Button>
          </View>
        </ScrollView>
      </Authenticated>
    </SafeAreaView>
  );
}

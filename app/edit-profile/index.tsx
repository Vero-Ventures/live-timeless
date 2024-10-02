import { useNavigation } from "@react-navigation/native";
import React, { useLayoutEffect, useState } from "react";
import { Redirect } from "expo-router";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import {
  FlatList,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Loader2 } from "lucide-react-native";
import InputField from "~/components/profile/input-field";
import { useEditProfile } from "~/hooks/useEditProfile";
import GenderSelectionModal from "~/components/profile/gender-selection-modal";

export default function EditProfile() {
  const navigation = useNavigation();
  const [isGenderModalVisible, setGenderModalVisible] = useState(false);
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
              style={{ marginBottom: 40 }}
            />
            {/* DOB */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: "#a6b1c3", marginBottom: 0, marginTop: 16, fontSize :16 }}>
                Date of Birth
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ width: "30%" }}>
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
                  />
                </View>
                <View style={{ width: "30%" }}>
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
                  />
                </View>
                <View style={{ width: "30%" }}>
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
                  />
                </View>
              </View>
            </View>

            {/* Gender */}
            <View style={{ marginBottom: 0 }}>
              <Text style={{ color: "#a6b1c3", marginBottom: 8, fontSize: 16 }}>Gender</Text>
              <TouchableOpacity
                onPress={() => setGenderModalVisible(true)} // Show modal when pressed
                style={{
                  backgroundColor: "#0e2942",
                  borderRadius: 8,
                  padding: 16,
                  borderColor: "#0e2942",
                  borderWidth: 1,
                  marginBottom: 8,
                }}
              >
                <Text style={{ color: "#ffffff" }}>
                  {gender ? gender : "Select Gender"} {}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Modal */}
            <GenderSelectionModal
            visible={isGenderModalVisible}
            options={genderOptions}
            selectedValue={gender}
            onSelect={setGender}
            onClose={() => setGenderModalVisible(false)}
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

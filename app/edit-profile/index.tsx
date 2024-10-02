import { useNavigation } from '@react-navigation/native';
import React, { useLayoutEffect } from 'react';
import { useQuery } from "convex/react";
import { Redirect, useRouter } from "expo-router";
import { api } from "~/convex/_generated/api";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { View, StyleSheet } from "react-native";
import { Input } from "~/components/ui/input";
import { Loader2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useMutation } from 'convex/react';  // Correct import
import { updateUserProfile } from "~/convex/users";  // Import mutation
import DropDownPicker from 'react-native-dropdown-picker';

import InputField from "~/components/profile/input-field"; // Import InputField

export default function EditProfile() {
  const navigation = useNavigation();
  const router = useRouter();
  const user = useQuery(api.users.currentUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dobDay, setDobDay] = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear, setDobYear] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  const [open, setOpen] = useState(false);
  const [genderOptions] = useState([
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Unspecified', value: 'Unspecified' }
  ]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Edit Profile',
      headerStyle: { backgroundColor: '#082139' },
      headerBackTitleVisible: false,
    });
  }, [navigation]);

 // Use mutation hook with the correct mutation function
  const updateUserProfileMutation = useMutation(api.users.updateUserProfile);

  useEffect(() => {
    if (user) {
      const [year, month, day] = (user.dob ?? "").split('-');
      setDobYear(year || "");
      setDobMonth(month || "");
      setDobDay(day || "");

      setName(user.name || "");
      setEmail(user.email || "");
      setGender(user.gender || "");
      setHeight(user.height ? user.height.toString() : "");
      setWeight(user.weight ? user.weight.toString() : "");
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (user) {
      const dob = `${dobYear}-${dobMonth}-${dobDay}`;
      
      await updateUserProfileMutation({
        id: user._id,
        name,
        email,
        dob,
        gender,
        height: parseFloat(height),
        weight: parseFloat(weight),
      });
      router.push("/profile");
    }
  };

  return (
    <SafeAreaView style={{backgroundColor: "#082139"}}>
      <AuthLoading>
      <View className="h-full items-center justify-center">
      <Loader2 className="size-32 animate-spin" />
        </View>
      </AuthLoading>
      <Unauthenticated>
        <Redirect href="/" />
      </Unauthenticated>
      <Authenticated>
        <View style={{ flex: 1, gap: 8, padding: 16 }}>
          <InputField
            label="Name"
            placeholder="Name"
            value={name}
            setValue={setName}
          />
          <InputField
            label="Email"
            placeholder="Email"
            value={email}
            setValue={setEmail}
          />
          
          <View style={{ marginBottom: 16 }}>
            <Text style={{ color: "#a6b1c3", marginBottom: 8 }}>Date of Birth</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
              <InputField
                placeholder="Month"
                value={dobMonth}
                setValue={(month) => {
                  if(month === '' || (parseInt(month) >= 1 && parseInt(month) <= 12))
                  setDobMonth(month);
                }}
                keyboardType="numeric"
                maxLength={2}
                style={{ flex: 1 }}
              />
              <InputField
                placeholder="Day"
                value={dobDay}
                setValue={(day) => {
                  if(day === '' || (parseInt(day) >= 1 && parseInt(day) <= 31))
                  setDobDay(day);
                }}            
                keyboardType="numeric"
                maxLength={2}
                style={{ flex: 1 }}
              />
              <InputField
                placeholder="Year"
                value={dobYear}
                setValue={(year) => {
                  const currentYear = new Date().getFullYear();
                  if(year === '' || (parseInt(year) >= 1 && parseInt(year) <= currentYear))
                  setDobYear(year);
                }}   
                keyboardType="numeric"
                maxLength={4}
                style={{ flex: 1 }}
              />
            </View>
          </View>

          <Input 
            className="native:h-16 flex-1 rounded-xl border-0 bg-[#0e2942]"
            placeholder="Gender"
            placeholderTextColor='#a6b1c3'
            value={gender}
            onChangeText={setGender}
          />
          <Input 
            className="native:h-16 flex-1 rounded-xl border-0 bg-[#0e2942]"
            placeholder="Height (cm)"
            value={height}
            setValue={setHeight}
            keyboardType="numeric"
          />
          <InputField
            label="Weight (kg)"
            placeholder="Weight (kg)"
            value={weight}
            setValue={setWeight}
            keyboardType="numeric"
          />
          <Button onPress={handleUpdateProfile}>
            <Text style={{ color: '#fff' }}>Save</Text>
          </Button>
        </View>
      </Authenticated>
    </SafeAreaView>
  );
}
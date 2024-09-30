import { useNavigation } from '@react-navigation/native';
import { useLayoutEffect } from 'react';
import { useQuery } from "convex/react";
import { Redirect, useRouter } from "expo-router";
import { api } from "~/convex/_generated/api";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { View } from "react-native";
import { Input } from "~/components/ui/input";
import { Loader2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useMutation } from 'convex/react';  // Correct import
import { updateUserProfile } from "~/convex/users";  // Import mutation

export default function EditProfile() {
  const navigation = useNavigation();
  const router = useRouter();
  const user = useQuery(api.users.currentUser);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

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
      setName(user.name || "");
      setEmail(user.email || "");
      setDob(user.dob || "");
      setGender(user.gender || "");
      setHeight(user.height ? user.height.toString() : "");
      setWeight(user.weight ? user.weight.toString() : "");
    }
  }, [user]);

  const handleUpdateProfile = async () => {
    if (user) {
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
        <View className="h-full gap-8 p-4">
          <Input 
            className="native:h-16 flex-1 rounded-xl border-0 bg-[#0e2942]"
            placeholder="Name"
            placeholderTextColor='#a6b1c3'
            value={name}
            onChangeText={setName}
          />
          <Input 
            className="native:h-16 flex-1 rounded-xl border-0 bg-[#0e2942]"
            placeholder="Email"
            placeholderTextColor='#a6b1c3'
            value={email}
            onChangeText={setEmail}
          />
          <Input 
            className="native:h-16 flex-1 rounded-xl border-0 bg-[#0e2942]"
            placeholder="Date of Birth"
            placeholderTextColor='#a6b1c3'
            value={dob}
            onChangeText={setDob}
          />
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
            placeholderTextColor='#a6b1c3'
            value={height}
            onChangeText={setHeight}
            keyboardType="numeric"
          />
          <Input 
            className="native:h-16 flex-1 rounded-xl border-0 bg-[#0e2942]"
            placeholder="Weight (kg)"
            placeholderTextColor='#a6b1c3'
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
          />
          <Button onPress={handleUpdateProfile}>
            <Text>Save</Text>
          </Button>
          </View>
          </Authenticated>
    </SafeAreaView>
  );
}

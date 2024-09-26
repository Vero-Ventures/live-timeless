import { useQuery } from "convex/react";
import { Link, Redirect } from "expo-router";
import { View } from "react-native";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { Loader2 } from "lucide-react-native";
import { useAuthActions } from "@convex-dev/auth/dist/react";

export default function EditProfile() {
  const user = useQuery(api.users.currentUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "#082139" }}>
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
          <View className="gap-4">
            <View className="mx-auto">
            </View>
            <Text className="text-center text-xl font-bold">{user?.name}</Text>
            <Text className="text-center">{user?.email}</Text>
            
          </View>
        </View>
      </Authenticated>
    </SafeAreaView>
  );
}

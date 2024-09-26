import { useQuery } from "convex/react";
import { Link, Redirect, useRouter } from "expo-router";
import { api } from "~/convex/_generated/api";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { SafeAreaView } from "react-native-safe-area-context";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";
import { View } from "react-native";
import { Input } from "~/components/ui/input";
import { Loader2 } from "lucide-react-native";
import { useEffect, useState } from "react";
import { updateUserProfile } from "~/convex/users";
import { useMutation } from 'convex/react';


export default function EditProfile() {
    const router = useRouter();
    const user = useQuery(api.users.currentUser);
    
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    // const [dob, setDob] = useState("");
    // const [gender, setGender] = useState("");
    // const [height, setHeight] = useState("");
    // const [weight, setWeight] = useState("");

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
            // setDob(user.dob || "");
            // setGender(user.gender || "");
            // setHeight(user.height || "");
            // setWeight(user.weight || "");
        }
    } , [user]);

    const updateUserProfileMutation = useMutation(updateUserProfile);

    const handleUpdateProfile = async () => {
        if (user) {
            await updateUserProfileMutation({
                id: user._id,
                name,
                email,
            })
        }
    }

    return (
        <SafeAreaView>
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
                    value={name}
                    onChangeText={setName}
                />
                <Input 
                    className="native:h-16 flex-1 rounded-xl border-0 bg-[#0e2942]"
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
                <Button onPress={handleUpdateProfile}><Text>Save</Text></Button>
                </View>
            </Authenticated>
        </SafeAreaView>
    );
}
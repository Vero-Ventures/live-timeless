import { Stack } from "expo-router";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

export default function Reminders() {
  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff",
          headerTitle: "",
          headerBackTitleVisible: false,
        }}
      />
      <View className="h-full bg-[#082139] p-4">
        <Text>Unit Types</Text>
      </View>
    </>
  );
}

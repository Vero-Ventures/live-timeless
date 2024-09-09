import { Stack } from "expo-router";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { fontFamily } from "~/lib/font";

export default function Repeat() {
  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff",
          headerTitle: () => (
            <Text style={{ fontFamily: fontFamily.openSans.bold }}>Repeat</Text>
          ),
          headerBackTitleVisible: false,
        }}
      />
      <View>
        <Text>Repeat</Text>
      </View>
    </>
  );
}

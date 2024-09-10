import { Stack } from "expo-router";
import { ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { fontFamily } from "~/lib/font";
import { Check } from "~/lib/icons/Check";

export default function TimeOfDay() {
  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff",
          headerTitle: () => (
            <Text style={{ fontFamily: fontFamily.openSans.bold }}>
              Time of Day
            </Text>
          ),
          headerBackTitleVisible: false,
        }}
      />
      <ScrollView
        className="pt-10"
        contentContainerStyle={{
          paddingBottom: 250,
        }}
        style={{ height: "100%" }}
      >
        <View className="gap-12">
          <TimePeriodOption period="Morning" isChecked />
          <TimePeriodOption period="Afternoon" isChecked />
          <TimePeriodOption period="Evening" isChecked />
        </View>
      </ScrollView>
    </>
  );
}

function TimePeriodOption({
  period,
  isChecked = false,
}: {
  period: string;
  isChecked?: boolean;
}) {
  return (
    <View className="flex flex-row justify-between px-5">
      <Text
        className="text-lg"
        style={{
          fontFamily: fontFamily.openSans.bold,
          letterSpacing: 0.5,
        }}
      >
        {period}
      </Text>
      {isChecked && <Check />}
    </View>
  );
}

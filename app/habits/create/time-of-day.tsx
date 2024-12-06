import { Stack } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { fontFamily } from "~/lib/font";
import { Check } from "~/lib/icons/Check";
import { useHabitFormStore } from "./habit-store";
import { cn } from "~/lib/utils";
import { useShallow } from "zustand/react/shallow";

export default function TimeOfDay() {
  const [timeOfDay, setTimeOfDay] = useHabitFormStore(
    useShallow((s) => [s.timeOfDay, s.setTimeOfDay])
  );
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
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 250,
          height: "100%",
          backgroundColor: "#082139",
        }}
      >
        <View className="h-full pt-10">
          <TimePeriodOption
            period="Morning"
            className="border-b border-[#9cc5ff13]"
            isChecked={timeOfDay.includes("Morning")}
            onPress={() => {
              if (timeOfDay.includes("Morning")) {
                setTimeOfDay(timeOfDay.filter((t) => t !== "Morning"));
              } else {
                setTimeOfDay([...timeOfDay, "Morning"]);
              }
            }}
          />
          <TimePeriodOption
            className="border-b border-[#9cc5ff13]"
            period="Afternoon"
            isChecked={timeOfDay.includes("Afternoon")}
            onPress={() => {
              if (timeOfDay.includes("Afternoon")) {
                setTimeOfDay(timeOfDay.filter((t) => t !== "Afternoon"));
              } else {
                setTimeOfDay([...timeOfDay, "Afternoon"]);
              }
            }}
          />
          <TimePeriodOption
            period="Evening"
            isChecked={timeOfDay.includes("Evening")}
            onPress={() => {
              if (timeOfDay.includes("Evening")) {
                setTimeOfDay(timeOfDay.filter((t) => t !== "Evening"));
              } else {
                setTimeOfDay([...timeOfDay, "Evening"]);
              }
            }}
          />
        </View>
      </ScrollView>
    </>
  );
}

function TimePeriodOption({
  period,
  isChecked = false,
  onPress,
  className,
}: {
  period: string;
  isChecked?: boolean;
  onPress: () => void;
  className?: string;
}) {
  return (
    <Pressable
      className={cn(
        "flex flex-row justify-between bg-[#0e2942] px-5 py-4",
        className
      )}
      onPress={onPress}
    >
      <Text
        className="text-lg"
        style={{
          fontFamily: fontFamily.openSans.bold,
          letterSpacing: 0.5,
        }}
      >
        {period}
      </Text>
      {!!isChecked && <Check />}
    </Pressable>
  );
}

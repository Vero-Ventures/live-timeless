import { Stack } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { useState } from "react";

import { Text } from "~/components/ui/text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { fontFamily } from "~/lib/font";
import { Check } from "~/lib/icons/Check";
import { useCreateGoalFormStore } from "./create-goal-store";

export default function Repeat() {
  const [value, setValue] = useState("daily");
  const { dailyRepeat, setDailyRepeat } = useCreateGoalFormStore();
  const numbers = Array.from({ length: 29 }, (_, index) => index + 2);

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
      <View className="h-full bg-[#082139]">
        <Tabs
          value={value}
          onValueChange={setValue}
          className="w-full flex-col gap-2"
        >
          <TabsList className="mb-6 w-full flex-row justify-center rounded-none bg-[#172e4b]">
            <TabsTrigger value="daily" className="flex-1">
              <Text>Daily</Text>
            </TabsTrigger>
            <TabsTrigger value="monthly" className="flex-1">
              <Text>Monthly</Text>
            </TabsTrigger>
            <TabsTrigger value="interval" className="flex-1">
              <Text>Interval</Text>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="daily">
            <ScrollView
              contentContainerStyle={{
                paddingBottom: 250,
              }}
              style={{ height: "100%" }}
            >
              <View className="gap-12">
                <DailyRepeat
                  dayOfWeek="Sunday"
                  isChecked={dailyRepeat.includes("Sunday")}
                  onPress={() => {
                    if (dailyRepeat.includes("Sunday")) {
                      setDailyRepeat(dailyRepeat.filter((t) => t !== "Sunday"));
                    } else {
                      setDailyRepeat([...dailyRepeat, "Sunday"]);
                    }
                  }}
                />
                <DailyRepeat
                  dayOfWeek="Monday"
                  isChecked={dailyRepeat.includes("Monday")}
                  onPress={() => {
                    if (dailyRepeat.includes("Monday")) {
                      setDailyRepeat(dailyRepeat.filter((t) => t !== "Monday"));
                    } else {
                      setDailyRepeat([...dailyRepeat, "Monday"]);
                    }
                  }}
                />
                <DailyRepeat
                  dayOfWeek="Tuesday"
                  isChecked={dailyRepeat.includes("Tuesday")}
                  onPress={() => {
                    if (dailyRepeat.includes("Tuesday")) {
                      setDailyRepeat(
                        dailyRepeat.filter((t) => t !== "Tuesday")
                      );
                    } else {
                      setDailyRepeat([...dailyRepeat, "Tuesday"]);
                    }
                  }}
                />
                <DailyRepeat
                  dayOfWeek="Wednesday"
                  isChecked={dailyRepeat.includes("Wednesday")}
                  onPress={() => {
                    if (dailyRepeat.includes("Wednesday")) {
                      setDailyRepeat(
                        dailyRepeat.filter((t) => t !== "Wednesday")
                      );
                    } else {
                      setDailyRepeat([...dailyRepeat, "Wednesday"]);
                    }
                  }}
                />
                <DailyRepeat
                  dayOfWeek="Thursday"
                  isChecked={dailyRepeat.includes("Thursday")}
                  onPress={() => {
                    if (dailyRepeat.includes("Thursday")) {
                      setDailyRepeat(
                        dailyRepeat.filter((t) => t !== "Thursday")
                      );
                    } else {
                      setDailyRepeat([...dailyRepeat, "Thursday"]);
                    }
                  }}
                />
                <DailyRepeat
                  dayOfWeek="Friday"
                  isChecked={dailyRepeat.includes("Friday")}
                  onPress={() => {
                    if (dailyRepeat.includes("Friday")) {
                      setDailyRepeat(dailyRepeat.filter((t) => t !== "Friday"));
                    } else {
                      setDailyRepeat([...dailyRepeat, "Friday"]);
                    }
                  }}
                />
                <DailyRepeat
                  dayOfWeek="Saturday"
                  isChecked={dailyRepeat.includes("Saturday")}
                  onPress={() => {
                    if (dailyRepeat.includes("Saturday")) {
                      setDailyRepeat(
                        dailyRepeat.filter((t) => t !== "Saturday")
                      );
                    } else {
                      setDailyRepeat([...dailyRepeat, "Saturday"]);
                    }
                  }}
                />
              </View>
            </ScrollView>
          </TabsContent>
          <TabsContent value="monthly">
            <MonthlyRepeat />
          </TabsContent>
          <TabsContent value="interval">
            <ScrollView
              contentContainerStyle={{
                paddingBottom: 250,
              }}
              style={{ height: "100%" }}
            >
              <View className="gap-12">
                {numbers.map((number) => (
                  <IntervalRepeat key={number} interval={number} />
                ))}
              </View>
            </ScrollView>
          </TabsContent>
        </Tabs>
      </View>
    </>
  );
}

function DailyRepeat({
  dayOfWeek,
  isChecked = false,
  onPress,
}: {
  dayOfWeek: string;
  isChecked?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable className="flex flex-row justify-between px-5" onPress={onPress}>
      <Text
        className="text-lg"
        style={{
          fontFamily: fontFamily.openSans.bold,
          letterSpacing: 0.5,
        }}
      >
        {dayOfWeek}
      </Text>
      {isChecked && <Check />}
    </Pressable>
  );
}

function MonthlyRepeat() {
  const rows = [
    [1, 2, 3, 4, 5, 6, 7],
    [8, 9, 10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19, 20, 21],
    [22, 23, 24, 25, 26, 27, 28],
    [29, 30, 31],
  ];
  const [selectedDays, setSelectedDays] = useState<number[]>([]);

  return (
    <View>
      {rows.map((row, index) => (
        <View
          key={index}
          className="flex w-full flex-row flex-wrap justify-start"
        >
          {row.map((num) => (
            <Pressable
              onPress={() => {
                if (selectedDays.includes(num)) {
                  setSelectedDays(selectedDays.filter((day) => day !== num));
                } else {
                  setSelectedDays([...selectedDays, num]);
                }
              }}
              key={num}
              className={`h-16 w-[14.28%] items-center justify-center bg-[#172e4b] ${
                selectedDays.includes(num) ? "bg-[#007bff8c]" : ""
              }`}
            >
              <Text
                className="text-center text-lg"
                style={{ fontFamily: fontFamily.openSans.semiBold }}
              >
                {num}
              </Text>
            </Pressable>
          ))}
        </View>
      ))}
    </View>
  );
}

function IntervalRepeat({
  interval,
  isChecked = false,
}: {
  interval: number;
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
        Every {interval} days
      </Text>
      {isChecked && <Check />}
    </View>
  );
}

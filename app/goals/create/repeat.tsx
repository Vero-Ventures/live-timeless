import { Stack } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { useState } from "react";

import { Text } from "~/components/ui/text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { fontFamily } from "~/lib/font";
import { Check } from "~/lib/icons/Check";

export default function Repeat() {
  const [value, setValue] = useState("daily");
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
                <DailyRepeat dayOfWeek="Sunday" isChecked />
                <DailyRepeat dayOfWeek="Monday" isChecked />
                <DailyRepeat dayOfWeek="Tuesday" isChecked />
                <DailyRepeat dayOfWeek="Wednesday" isChecked />
                <DailyRepeat dayOfWeek="Thursday" isChecked />
                <DailyRepeat dayOfWeek="Friday" isChecked />
                <DailyRepeat dayOfWeek="Saturday" isChecked />
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
}: {
  dayOfWeek: string;
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
        {dayOfWeek}
      </Text>
      {isChecked && <Check />}
    </View>
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

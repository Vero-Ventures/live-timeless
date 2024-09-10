import { Stack } from "expo-router";
import { ScrollView, View } from "react-native";
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
      <View>
        <Tabs
          value={value}
          onValueChange={setValue}
          className="mx-auto w-full max-w-[400px] flex-col gap-1.5"
        >
          <TabsList className="w-full flex-row">
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
              className="pt-10"
              contentContainerStyle={{
                paddingBottom: 300,
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
            <Text>Tab Content 2</Text>
          </TabsContent>
          <TabsContent value="interval">
            <ScrollView
              className="pt-10"
              contentContainerStyle={{
                paddingBottom: 300,
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

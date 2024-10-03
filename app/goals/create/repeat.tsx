import { Stack } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";

import { Text } from "~/components/ui/text";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { fontFamily } from "~/lib/font";
import { Check } from "~/lib/icons/Check";
import { initialFormState, useGoalFormStore } from "./create-goal-store";
import { cn } from "~/lib/utils";
import { Separator } from "~/components/ui/separator";
import { useShallow } from "zustand/react/shallow";

export default function Repeat() {
  const [
    repeatType,
    setRepeatType,
    dailyRepeat,
    setDailyRepeat,
    resetDailyRepeat,
    resetMonthlyRepeat,
    intervalRepeat,
    resetIntervalRepeat,
  ] = useGoalFormStore(
    useShallow((s) => [
      s.repeatType,
      s.setRepeatType,
      s.dailyRepeat,
      s.setDailyRepeat,
      s.resetDailyRepeat,
      s.resetMonthlyRepeat,
      s.intervalRepeat,
      s.resetIntervalRepeat,
    ])
  );
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
          headerShadowVisible: false,
        }}
      />
      <View className="h-full bg-[#0b1a28]">
        <Tabs
          value={repeatType}
          onValueChange={(value) => {
            const isRepeatType =
              value === "daily" || value === "monthly" || value === "interval";

            if (!isRepeatType) {
              return;
            }

            switch (value) {
              case "daily":
                resetDailyRepeat();
                break;
              case "monthly":
                resetMonthlyRepeat();
                break;
              case "interval":
                resetIntervalRepeat();
                break;
            }

            setRepeatType(value);
          }}
          className="w-full flex-col"
        >
          <TabsList className="m-4 mb-4 flex-row justify-center rounded-md bg-[#172e4b]">
            <TabsTrigger value="daily" className="flex-1 rounded-md">
              <Text>Daily</Text>
            </TabsTrigger>
            <Separator orientation="vertical" className="h-[30px]" />
            <TabsTrigger value="monthly" className="flex-1 rounded-md">
              <Text>Monthly</Text>
            </TabsTrigger>
            <Separator orientation="vertical" className="h-[30px]" />
            <TabsTrigger value="interval" className="flex-1 rounded-md">
              <Text>Interval</Text>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="daily">
            <View>
              {initialFormState.dailyRepeat.map((day) => (
                <DailyRepeat
                  key={day}
                  dayOfWeek={day}
                  isChecked={dailyRepeat.includes(day)}
                  onPress={() => {
                    setDailyRepeat(
                      dailyRepeat.includes(day)
                        ? dailyRepeat.filter((t) => t !== day)
                        : [...dailyRepeat, day]
                    );
                  }}
                />
              ))}
            </View>
          </TabsContent>
          <TabsContent value="monthly">
            <MonthlyRepeat />
          </TabsContent>
          <TabsContent value="interval">
            <ScrollView
              contentContainerStyle={{
                paddingBottom: 150,
              }}
              style={{ height: "100%" }}
            >
              <View>
                {numbers.map((number) => (
                  <IntervalRepeat
                    key={number}
                    interval={number}
                    isChecked={intervalRepeat === number}
                  />
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
    <Pressable
      className="flex flex-row justify-between border-b border-[#172e4b] bg-[#082139] px-5 py-4"
      onPress={onPress}
    >
      <Text
        className="text-lg"
        style={{
          fontFamily: fontFamily.openSans.bold,
          letterSpacing: 0.5,
        }}
      >
        {dayOfWeek}
      </Text>
      {!!isChecked && <Check />}
    </Pressable>
  );
}

function MonthlyRepeat() {
  const days = Array.from({ length: 31 }, (_, index) => index + 1);
  const [monthlyRepeat, setMonthlyRepeat] = useGoalFormStore(
    useShallow((s) => [s.monthlyRepeat, s.setMonthlyRepeat])
  );

  return (
    <View>
      <View className="flex w-full flex-row flex-wrap justify-start">
        {days.map((day) => (
          <Pressable
            onPress={() => {
              if (monthlyRepeat.includes(day)) {
                setMonthlyRepeat(monthlyRepeat.filter((day) => day !== day));
              } else {
                setMonthlyRepeat([...monthlyRepeat, day]);
              }
            }}
            key={day}
            className={cn(
              "h-16 w-[14.28%] items-center justify-center bg-[#172e4b]",
              monthlyRepeat.includes(day) && "bg-[#007bff8c]"
            )}
          >
            <Text
              className="text-center text-lg"
              style={{ fontFamily: fontFamily.openSans.semiBold }}
            >
              {day}
            </Text>
          </Pressable>
        ))}
      </View>
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
  const setIntervalRepeat = useGoalFormStore((s) => s.setIntervalRepeat);

  return (
    <Pressable
      onPress={() => {
        setIntervalRepeat(interval);
      }}
      className="flex flex-row justify-between border-b border-[#172e4b] bg-[#082139] px-5 py-4"
    >
      <Text
        className="text-lg"
        style={{
          fontFamily: fontFamily.openSans.bold,
          letterSpacing: 0.5,
        }}
      >
        Every {interval} days
      </Text>
      {!!isChecked && <Check />}
    </Pressable>
  );
}

import {
  FlatList,
  Pressable,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Link, SplashScreen, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { fontFamily } from "~/lib/font";
import { Plus } from "lucide-react-native";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { HABIT_ICONS } from "~/constants/habit-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { FunctionReturnType } from "convex/server";

export default function HabitsPage() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaView
      style={{
        height: "100%",
        backgroundColor: "#082139",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <View className="habit-container px-4">
        <DateHeading />
        <Text
          className="text-2xl"
          style={{
            fontFamily: fontFamily.openSans.bold,
          }}
        >
          Habits
        </Text>
        <Separator className="my-6 bg-[#fff]/10" />
        <HabitList />
      </View>
      <View className="flex-row items-center gap-2 bg-[#0f2336] px-4">
        <CalendarStrip />
        <Separator className="mr-2" orientation="vertical" />
        <Link href="/habits/create" asChild>
          <Button size="icon" className="h-14 w-14 rounded-full">
            <Plus color="#fff" size={30} />
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}

function DateHeading() {
  const { date } = useLocalSearchParams<{ date?: string }>();
  const { today, tomorrow, yesterday } = getTodayYesterdayTomorrow();
  const selectedDate = date ? new Date(Number(date)) : today;
  return (
    <Text className="mb-2 text-sm uppercase text-gray-500">
      {selectedDate.toDateString() === today.toDateString()
        ? "Today"
        : selectedDate.toDateString() === yesterday.toDateString()
          ? "Yesterday"
          : selectedDate.toDateString() === tomorrow.toDateString()
            ? "Tomorrow"
            : selectedDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
    </Text>
  );
}
function HabitList() {
  const { date } = useLocalSearchParams<{ date?: string }>();
  const { today } = getTodayYesterdayTomorrow();
  const selectedDate = date ? new Date(Number(date)) : today;
  const habits = useQuery(api.habits.listHabits, {
    date: selectedDate.toUTCString(),
  });

  return !habits ? (
    <View className="mt-10 flex-1 gap-2">
      <ActivityIndicator />
    </View>
  ) : (
    <FlatList
      contentContainerStyle={{
        flex: 1,
      }}
      data={habits}
      ItemSeparatorComponent={() => (
        <Separator className="my-4 h-0.5 bg-[#fff]/10" />
      )}
      ListEmptyComponent={() => (
        <View className="h-full justify-center gap-6">
          <Text className="text-center text-2xl font-bold">
            Welcome to Live Timeless
          </Text>
          <Text className="text-center">
            Our habit tracker shows your progress day by day. Unlock your
            potential and start your journey today!
          </Text>
          <Link href="/habits/create" asChild>
            <Button>
              <Text>Build a habit</Text>
            </Button>
          </Link>
        </View>
      )}
      renderItem={({ item }) => (
        <HabitItem habit={item} selectedDate={selectedDate} />
      )}
      keyExtractor={(item) => item._id.toString()}
    />
  );
}

function HabitItem({
  habit,
  selectedDate,
}: {
  habit: NonNullable<FunctionReturnType<typeof api.habits.listHabits>>[number];
  selectedDate: Date;
}) {
  const createHabitLog = useMutation(api.habitLogs.createHabitLog);
  const updateHabitLog = useMutation(api.habitLogs.updateHabitLog);
  const updatePoints = useMutation(api.challenges.updatePoints);

  const IconComp = HABIT_ICONS.find(
    (icon) => icon.name === habit.selectedIcon
  )?.component;

  async function handleLogTimesHabits() {
    if (!habit.log) {
      const newLogId = await createHabitLog({
        habitId: habit._id,
        isComplete: habit.unitValue === 1,
        date: selectedDate.getTime(),
        unitsCompleted: 1, // Initialize with zero units completed
      });

      if (!newLogId) {
        throw new Error("Failed to create a new habit log.");
      }
    } else {
      if (habit.log.isComplete) {
        Alert.alert(
          "Habits Completed",
          "This habit has already been completed."
        );
        return;
      }

      const newUnitsCompleted = habit.log.unitsCompleted + 1;
      const hasHabitBeenCompleted = newUnitsCompleted === habit.unitValue;

      if (hasHabitBeenCompleted) {
        await updateHabitLog({
          habitLogId: habit.log._id,
          unitsCompleted: newUnitsCompleted,
          isComplete: true,
        });
        Alert.alert(
          "Habit Completed",
          "Congratulations! You’ve completed this habit."
        );
      } else {
        await updateHabitLog({
          habitLogId: habit.log._id,
          unitsCompleted: newUnitsCompleted,
        });
      }

      if (habit.challengeId) {
        await updatePoints({
          unitsCompleted: newUnitsCompleted,
          rate: habit.rate || 1,
        });
      }
    }
  }
  async function handleLogDurationHabits() {
    if (!habit.log) {
      const newLogId = await createHabitLog({
        habitId: habit._id,
        isComplete: false,
        date: selectedDate.getTime(),
        unitsCompleted: 0,
      });

      if (!newLogId) {
        throw new Error("Failed to create a new habit log.");
      }
      router.push({
        pathname: "/habits/[habitId]/[habitLogId]/start",
        params: {
          habitId: habit._id,
          habitLogId: newLogId,
        },
      });
    } else {
      router.push({
        pathname: "/habits/[habitId]/[habitLogId]/start",
        params: {
          habitId: habit._id,
          habitLogId: habit.log._id,
        },
      });
    }
  }
  async function handleLogProgressHabits() {
    if (!habit.log) {
      const newLogId = await createHabitLog({
        habitId: habit._id,
        isComplete: false,
        date: selectedDate.getTime(),
        unitsCompleted: 0, // Initialize with zero units completed
      });

      if (!newLogId) {
        throw new Error("Failed to create a new habit log.");
      }
      router.push({
        pathname: "/habits/[habitId]/[habitLogId]/start/logProgress",
        params: {
          habitId: habit._id,
          habitLogId: newLogId,
        },
      });
    } else {
      router.push({
        pathname: "/habits/[habitId]/[habitLogId]/start/logProgress",
        params: {
          habitId: habit._id,
          habitLogId: habit.log._id,
        },
      });
    }
  }

  return (
    <View className="flex-row items-center gap-4">
      <Link
        href={{
          pathname: `/habits/[habitId]`,
          params: {
            habitId: habit._id,
            selectedHabitLogDate: encodeURIComponent(
              selectedDate.toISOString()
            ),
          },
        }}
        asChild
      >
        <Pressable className="flex-1">
          <View className="flex-row items-center gap-4">
            <View
              className={cn(
                "items-center justify-center rounded-full bg-[#299240]/20 p-1"
              )}
            >
              {IconComp ? (
                <IconComp
                  name={habit.selectedIcon}
                  color={habit.selectedIconColor}
                  size={32}
                />
              ) : (
                <MaterialCommunityIcons
                  name="alert-circle-outline"
                  color="gray"
                  size={32}
                />
              )}
            </View>

            <View className="w-full gap-2">
              <Text style={{ fontFamily: "openSans.medium" }}>
                {!!habit.challengeId && (
                  <IconComp name={"trophy"} color={"#FFD700"} size={15} />
                )}{" "}
                {habit.name}
              </Text>
              <Text className="text-xs text-muted-foreground">
                {habit.log
                  ? `${Number.isInteger(habit.log.unitsCompleted) ? habit.log.unitsCompleted : habit.log.unitsCompleted.toFixed(1)} / ${Number.isInteger(habit.unitValue) ? habit.unitValue : habit.unitValue.toFixed(1)} ${habit.unit}`
                  : `${Number.isInteger(habit.unitValue) ? habit.unitValue : habit.unitValue.toFixed(1)} ${habit.unit}`}
              </Text>
            </View>
          </View>
        </Pressable>
      </Link>
      {habit.unit === "times" ? (
        <Button className="bg-gray-600" onPress={handleLogTimesHabits}>
          <Text className="mr-2 text-white">Log</Text>
          <MaterialCommunityIcons
            name="check-circle-outline"
            size={16}
            color="white"
          />
        </Button>
      ) : habit.unit === "hours" || habit.unit === "mintutes" ? (
        <Button className="bg-gray-600" onPress={handleLogDurationHabits}>
          <MaterialCommunityIcons name="alarm" size={16} color="white" />
        </Button>
      ) : (
        <Button className="bg-gray-600" onPress={handleLogProgressHabits}>
          <Text className="mr-2 text-white">Log</Text>

          <MaterialCommunityIcons name="keyboard" size={16} color="white" />
        </Button>
      )}
    </View>
  );
}

function CalendarStrip() {
  const { date } = useLocalSearchParams<{ date?: string }>();
  const { today, tomorrow } = getTodayYesterdayTomorrow();
  const [selectedDate, setSelectedDate] = useState(
    date ? new Date(Number(date)) : today
  );
  const scrollViewRef = useRef<ScrollView>(null);
  const dates = Array.from({ length: 17 }, (_, i) => {
    const date = new Date(tomorrow);
    date.setDate(tomorrow.getDate() - i);
    return date;
  }).reverse();

  useEffect(() => {
    const id = setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 15 * 63, animated: true });
      }
    }, 100);
    return () => clearTimeout(id);
  }, []);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="py-4"
      ref={scrollViewRef}
    >
      {dates.map((date, index) => (
        <Pressable
          key={index}
          className={cn("mx-2 items-center", {
            "rounded-md bg-primary/50 p-2":
              date.toDateString() === selectedDate.toDateString(),
            "p-2": date.toDateString() !== selectedDate.toDateString(),
          })}
          onPress={() => {
            setSelectedDate(date);
            router.setParams({ date: date.getTime() });
          }}
        >
          <Text
            style={{
              fontFamily: fontFamily.openSans.bold,
            }}
            className={cn("text-sm uppercase", {
              "text-[#fff]/50":
                date.toDateString() !== selectedDate.toDateString(),
            })}
          >
            {date.toLocaleDateString("en-US", { weekday: "short" })}
          </Text>
          <View className="w-14 items-center justify-center">
            <Text
              style={{
                fontFamily: fontFamily.openSans.bold,
              }}
              className={cn("text-sm", {
                "text-[#fff]/50":
                  date.toDateString() !== selectedDate.toDateString(),
              })}
            >
              {date.getDate()}
            </Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function getTodayYesterdayTomorrow() {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  return { today, tomorrow, yesterday };
}

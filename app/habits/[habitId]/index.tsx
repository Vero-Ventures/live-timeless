import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useMutation, useQuery } from "convex/react";
import { Stack, useLocalSearchParams, router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";
import * as DropdownMenu from "zeego/dropdown-menu";
import { Check, ChevronDown, X } from "lucide-react-native";
import { StatCard } from "~/components/habits/stat-card";
import { format, getDate } from "date-fns";

export default function HabitScreen() {
  const { habitId } = useLocalSearchParams<{
    habitId: Id<"habits">;
  }>();

  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const currentDay = getDate(today);

  const habit = useQuery(api.habits.getHabitByIdWithLogsForCurrentMonth, {
    habitId,
    month: currentMonth,
    year: currentYear,
  });

  // Get completed days in the current month
  const completedDays = habit?.logs
    .filter((log) => log.isComplete)
    .map((entry) => entry.day);

  const deleteHabit = useMutation(api.habits.deleteHabit);

  function countCurrentStreak() {
    if (!completedDays) {
      return 0;
    }

    // Count days up to today that are not completed
    let streakDays = [];
    for (let day = 1; day < currentDay; day++) {
      if (completedDays.includes(day)) {
        streakDays.push(day);
      } else {
        streakDays = [];
      }
    }
    // Needs to be done seperate because user might be in progress of completing this habit today
    if (completedDays.includes(currentDay)) {
      streakDays.push(currentDay);
    }
    return streakDays.length;
  }

  function countFailedDaysInCurrentMonth() {
    if (!completedDays) {
      return 0;
    }

    // Count days up to today that are not completed
    let failedDayCount = 0;
    for (let day = 1; day <= currentDay; day++) {
      if (!completedDays.includes(day)) {
        failedDayCount++;
      }
    }
    return failedDayCount;
  }

  const failedDays = countFailedDaysInCurrentMonth();
  const currentStreak = countCurrentStreak();

  const totalUnitsCompleted = habit?.logs.reduce((acc, log) => {
    return acc + log.unitsCompleted;
  }, 0);

  const handleDelete = async () => {
    Alert.alert(
      `Are you sure you want to delete ${habit?.name}?`,
      "This action cannot be undone.",
      [
        {
          text: "Yes",
          onPress: async () => {
            router.dismiss(); // Dismiss first, page will break if habit does not exist before exit. Read nonexistent data
            await deleteHabit({ habitId });
          },
          style: "destructive",
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-background p-4">
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff",
          headerTitle: () => (
            <Text className="text-xl font-bold">{habit ? habit.name : ""}</Text>
          ),
          headerBackButtonDisplayMode: "minimal",
          headerRight: () => (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Pressable hitSlop={20}>
                  <FontAwesome5 name="ellipsis-h" size={20} color="#fff" />
                </Pressable>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content key="actions">
                <DropdownMenu.Item
                  onSelect={() =>
                    router.navigate({
                      pathname: "/habits/[habitId]/log-progress",
                      params: {
                        habitId,
                        year: currentYear,
                        month: currentDay,
                        day: currentDay,
                      },
                    })
                  }
                  key="log-progress"
                  textValue="Log Progress"
                >
                  <DropdownMenu.ItemIcon ios={{ name: "keyboard" }} />
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onSelect={() =>
                    router.navigate({
                      pathname: "/habits/[habitId]/log-history",
                      params: { habitId },
                    })
                  }
                  key="log-history"
                  textValue="Log History"
                >
                  <DropdownMenu.ItemIcon ios={{ name: "list.bullet" }} />
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onSelect={() =>
                    router.navigate({
                      pathname: "/habits/[habitId]/edit",
                      params: { habitId },
                    })
                  }
                  key="edit-habit"
                  textValue="Edit Habit"
                >
                  <DropdownMenu.ItemIcon ios={{ name: "pencil.line" }} />
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item
                  onSelect={handleDelete}
                  destructive
                  key="delete-habit"
                  textValue="Delete Habit"
                >
                  <DropdownMenu.ItemIcon ios={{ name: "trash" }} />
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          ),
        }}
      />
      {!habit ? (
        <View className="mt-10 flex flex-row justify-center gap-2">
          <ActivityIndicator />
        </View>
      ) : (
        <View className="gap-4 pb-20">
          <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
              <Pressable className="flex flex-row items-center justify-center gap-4 rounded-xl bg-card p-4">
                <Text className="text-lg font-bold">
                  {format(today, "LLLL")} {currentYear}
                </Text>
                <ChevronDown size={24} color="white" />
              </Pressable>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content key="actions">
              <DropdownMenu.Item onSelect={() => {}} key="month">
                <DropdownMenu.ItemTitle>This Month</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
              <DropdownMenu.Item onSelect={() => {}} key="year">
                <DropdownMenu.ItemTitle>This Year</DropdownMenu.ItemTitle>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
          <View className="flex flex-row items-center gap-4 rounded-xl bg-card p-6">
            <FontAwesome5 name="fire" size={36} color="#f9a825" />
            <View className="flex flex-col gap-2">
              <Text className="uppercase text-gray-400">Current Streak</Text>
              <Text className="text-xl font-bold">{currentStreak} Days</Text>
            </View>
          </View>

          <View className="gap-4">
            <View className="flex w-full flex-row gap-4">
              <StatCard
                titleIcon={<Check size={16} color="grey" />}
                title="Success"
                value={`${habit.logs.length} Days`}
              />

              <StatCard
                titleIcon={<X size={16} color="grey" />}
                title="Failed"
                value={`${failedDays} Days`}
              />
            </View>
            <View className="flex w-full flex-row gap-4">
              <StatCard
                title="Total"
                value={`${totalUnitsCompleted} ${habit.unit}`}
              />
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

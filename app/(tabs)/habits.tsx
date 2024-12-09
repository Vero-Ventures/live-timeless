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
import { Link, SplashScreen, router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { fontFamily } from "~/lib/font";
import { Plus } from "lucide-react-native";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import type { Doc } from "~/convex/_generated/dataModel";
import { HABIT_ICONS } from "~/constants/habit-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function HabitsPage() {
  const { today, tomorrow, yesterday } = getTodayYesterdayTomorrow();
  const [selectedDate, setSelectedDate] = useState(today);
  const habits = useQuery(api.habits.listHabits);
  const habitLogs = useQuery(api.habitLogs.listHabitLogs);

  useEffect(() => {
    if (habits && habitLogs) {
      SplashScreen.hideAsync();
    }
  }, [habits, habitLogs]);

  // const isDailyRepeat = (
  //   dailyRepeat: string[],
  //   startDate: Date,
  //   selectedDate: Date
  // ) => {
  //   const dayOfWeek = selectedDate.getDay();
  //   const days = [
  //     "Sunday",
  //     "Monday",
  //     "Tuesday",
  //     "Wednesday",
  //     "Thursday",
  //     "Friday",
  //     "Saturday",
  //   ];

  //   const isRepeatDay = dailyRepeat.includes(days[dayOfWeek]);

  //   const isAfterStartDate =
  //     selectedDate.getTime() >= new Date(startDate).getTime();

  //   return isRepeatDay && isAfterStartDate;
  // };

  // const isIntervalRepeat = (
  //   startDate: string | Date,
  //   intervalRepeat: number,
  //   selectedDate: Date
  // ) => {
  //   const diffInDays = Math.floor(
  //     (selectedDate.getTime() - new Date(startDate).getTime()) /
  //       (1000 * 60 * 60 * 24)
  //   );
  //   const isRepeatInterval =
  //     diffInDays >= 0 && diffInDays % intervalRepeat === 0;

  //   return isRepeatInterval;
  // };

  // const isMonthlyRepeat = (monthlyRepeat: number[], selectedDate: Date) => {
  //   const isRepeatDay = monthlyRepeat.includes(selectedDate.getDate());
  //   return isRepeatDay;
  // };

  const filteredHabits = habits
    ? habits
        .filter((habit) => {
          const startDate = new Date(habit.startDate);

          return selectedDate >= startDate;
        })
        .map((habit) => {
          const logForDate = habitLogs?.find(
            (log) =>
              log.habitId === habit._id &&
              new Date(log.date).toDateString() === selectedDate.toDateString()
          );

          return {
            ...habit,
            progress: logForDate ? logForDate.unitsCompleted : 0,
            isComplete: logForDate ? logForDate.isComplete : false,
            habitLogId: logForDate ? logForDate._id : null,
          };
        })
    : [];

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
        <Text
          className="text-2xl"
          style={{
            fontFamily: fontFamily.openSans.bold,
          }}
        >
          Habits
        </Text>
        {!habits || !habitLogs ? (
          <View className="mt-10 flex flex-row justify-center gap-2">
            <ActivityIndicator />
            <Text>Loading Habits...</Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={{
              paddingBottom: 60,
            }}
            className="mt-6 border-t border-t-[#fff]/10 pt-6"
            data={filteredHabits}
            ItemSeparatorComponent={() => (
              <Separator className="my-4 h-0.5 bg-[#fff]/10" />
            )}
            ListEmptyComponent={() => (
              <Text className="text-center">
                No habits found for this date.
              </Text>
            )}
            renderItem={({ item }) => (
              <HabitItem habit={item} selectedDate={selectedDate} />
            )}
            keyExtractor={(item) => item._id.toString()}
          />
        )}
      </View>
      <View className="flex-row items-center gap-2 bg-[#0f2336] px-4">
        <CalendarStrip
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
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

function HabitItem({
  habit,
  selectedDate,
}: {
  habit: Doc<"habits">;
  selectedDate: Date;
}) {
  const createHabitLog = useMutation(api.habitLogs.createHabitLog);
  const listHabitLogs = useQuery(api.habitLogs.listHabitLogs);
  const updateHabitLog = useMutation(api.habitLogs.updateHabitLog);
  const updatePoints = useMutation(api.challenges.updatePoints);

  const IconComp = HABIT_ICONS.find(
    (item) => item.name === habit.selectedIcon
  )?.component;

  // Find existing log for this habit and date
  const existingLog = listHabitLogs?.find(
    (log) =>
      log.habitId === habit._id &&
      new Date(log.date).toDateString() === selectedDate.toDateString()
  );

  async function handleLogPress() {
    if (!listHabitLogs) {
      Alert.alert("Error", "Unable to fetch habit logs.");
      return;
    }

    let log = existingLog;

    // Create a new log if one doesn't exist
    if (!log) {
      try {
        const newLogId = await createHabitLog({
          habitId: habit._id,
          isComplete: false,
          date: selectedDate.getTime(),
          unitsCompleted: 0, // Initialize with zero units completed
        });

        if (!newLogId) {
          throw new Error("Failed to create a new habit log.");
        }

        // Mock the log to use it in navigation
        log = {
          _id: newLogId,
          habitId: habit._id,
          date: selectedDate.getTime(),
          unitsCompleted: 0,
          isComplete: false,
          _creationTime: Date.now(), // Simulate creation time
        };
      } catch (error) {
        console.error("Error creating habit log:", error);
        Alert.alert("Error", "Failed to log habit progress.");
        return;
      }
    }

    if (habit.unit === "times") {
      // For "times" habits, increment the units
      if (log.isComplete) {
        Alert.alert(
          "Habits Completed",
          "This habit has already been completed."
        );
        return;
      }

      try {
        const newUnitsCompleted = (log.unitsCompleted ?? 0) + 1;
        const isHabitComplete = newUnitsCompleted >= habit.unitValue;

        await updateHabitLog({
          habitLogId: log._id,
          unitsCompleted: newUnitsCompleted,
          isComplete: isHabitComplete,
        });

        if (habit.challengeId) {
          await updatePoints({
            unitsCompleted: newUnitsCompleted,
            rate: habit.rate || 1,
          });
        }

        if (isHabitComplete) {
          Alert.alert(
            "Habit Completed",
            "Congratulations! You’ve completed this habit."
          );
        }
      } catch (error) {
        console.error("Error updating habit log:", error);
        Alert.alert("Error", "Failed to log habit progress.");
      }
      return; // Stop further execution for "times" habit
    }

    // Redirect to the appropriate logging screen for other habit types
    try {
      if (["hours", "minutes", "min"].includes(habit.unit)) {
        router.push({
          pathname: "/habits/[habitId]/[habitLogId]/start",
          params: {
            habitId: habit._id,
            habitLogId: log._id,
          },
        });
      } else {
        router.push({
          pathname: "/habits/[habitId]/[habitLogId]/start/logProgress",
          params: {
            habitId: habit._id,
            habitLogId: log._id,
          },
        });
      }
    } catch (error) {
      console.error("Error navigating to form:", error);
      Alert.alert("Error", "Failed to navigate to the logging form.");
    }
  }

  const buttonType = determineButtonType(habit);

  const buttonStyles =
    "w-20 h-10 justify-center flex-row items-center rounded-md";

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
                {existingLog
                  ? `${Number.isInteger(existingLog.unitsCompleted) ? existingLog.unitsCompleted : existingLog.unitsCompleted.toFixed(1)} / ${Number.isInteger(habit.unitValue) ? habit.unitValue : habit.unitValue.toFixed(1)} ${habit.unit}`
                  : `${Number.isInteger(habit.unitValue) ? habit.unitValue : habit.unitValue.toFixed(1)} ${habit.unit}`}
              </Text>
            </View>
          </View>
        </Pressable>
      </Link>

      <Pressable
        className={cn(buttonStyles, "bg-gray-600")}
        onPress={handleLogPress}
      >
        <Text className="mr-2 text-white">Log</Text>
        {buttonType === "keyboard" && (
          <MaterialCommunityIcons name="keyboard" size={16} color="white" />
        )}
        {buttonType === "alarm" && (
          <MaterialCommunityIcons name="alarm" size={16} color="white" />
        )}
        {buttonType === "checkmark" && (
          <MaterialCommunityIcons
            name="check-circle-outline"
            size={16}
            color="white"
          />
        )}
      </Pressable>
    </View>
  );
}

function determineButtonType(
  habit: Doc<"habits">
): "keyboard" | "alarm" | "checkmark" {
  const allowedUnits = [
    "steps",
    "kg",
    "grams",
    "mg",
    "oz",
    "pounds",
    "μg",
    "litres",
    "mL",
    "US fl oz",
    "cups",
    "kilojoules",
    "kcal",
    "cal",
    "joules",
    "km",
    "metres",
    "feet",
    "yards",
    "miles",
  ];

  if (habit.unit === "times") {
    return "checkmark"; // Show the checkmark for "times" unit
  } else if (["hours", "minutes"].includes(habit.unit)) {
    return "alarm"; // Show the alarm clock for duration-based units
  } else if (allowedUnits.includes(habit.unit)) {
    return "keyboard"; // Show the keyboard for specific allowed units
  }

  return "keyboard"; // Default to keyboard
}

function CalendarStrip({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: Date;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
}) {
  const scrollViewRef = useRef<ScrollView>(null);
  const { tomorrow } = getTodayYesterdayTomorrow();
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

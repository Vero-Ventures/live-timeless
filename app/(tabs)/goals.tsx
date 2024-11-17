import {
  FlatList,
  Pressable,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  type GestureResponderEvent,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Link, router, SplashScreen } from "expo-router";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import { fontFamily } from "~/lib/font";
import { Plus } from "lucide-react-native";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import type { Doc } from "~/convex/_generated/dataModel";
import { GOAL_ICONS } from "~/constants/goal-icons";
import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useMutation } from "convex/react";

export default function GoalsPage() {
  const { today, tomorrow, yesterday } = getTodayYesterdayTomorrow();
  const [selectedDate, setSelectedDate] = useState(today);
  const goals = useQuery(api.goals.listGoals);
  const goalLogs = useQuery(api.goalLogs.listGoalLogs);

  useEffect(() => {
    if (goals && goalLogs) {
      SplashScreen.hideAsync();
    }
  }, [goals, goalLogs]);

  const isDailyRepeat = (
    dailyRepeat: string[],
    startDate: Date,
    selectedDate: Date
  ) => {
    const dayOfWeek = selectedDate.getDay();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const isRepeatDay = dailyRepeat.includes(days[dayOfWeek]);

    // Convert both dates to timestamps for comparison
    const isAfterStartDate =
      selectedDate.getTime() >= new Date(startDate).getTime();

    return isRepeatDay && isAfterStartDate;
  };

  const isIntervalRepeat = (
    startDate: string | Date,
    intervalRepeat: number,
    selectedDate: Date
  ) => {
    const diffInDays = Math.floor(
      (selectedDate.getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const isRepeatInterval =
      diffInDays >= 0 && diffInDays % intervalRepeat === 0;

    return isRepeatInterval;
  };

  const isMonthlyRepeat = (monthlyRepeat: number[], selectedDate: Date) => {
    const isRepeatDay = monthlyRepeat.includes(selectedDate.getDate());
    return isRepeatDay;
  };

  // Filter goalLogs for the selectedDate
  const filteredGoalLogs = goalLogs
    ? goalLogs.filter((log) => {
        const goal = goals?.find((goal) => goal._id === log.goalId);
        if (!goal) return false;

        // Convert log date and selectedDate to comparable strings
        const logDate = new Date(log.date).toDateString();
        const selectedDateStr = selectedDate.toDateString();

        if (logDate !== selectedDateStr) return false;

        // Apply repeat pattern checks as before
        const startDate = new Date(goal.startDate);
        switch (goal.repeatType) {
          case "daily":
            return isDailyRepeat(goal.dailyRepeat, startDate, selectedDate);
          case "interval":
            return isIntervalRepeat(
              startDate,
              goal.intervalRepeat,
              selectedDate
            );
          case "monthly":
            return isMonthlyRepeat(goal.monthlyRepeat, selectedDate);
          default:
            return startDate.getTime() === selectedDate.getTime();
        }
      })
    : [];

  // Group filteredGoalLogs by goalId
  const groupedGoals = new Map();
  filteredGoalLogs.forEach((log) => {
    if (!groupedGoals.has(log.goalId)) {
      groupedGoals.set(log.goalId, []);
    }
    groupedGoals.get(log.goalId).push(log);
  });

  // Prepare matchedGoals, ensuring each goal has only one log for the selected date
  const matchedGoals = goals?.map((goal) => ({
    goal,
    goalLogs: groupedGoals.get(goal._id) || [], // Provide an empty array if no logs for the date
  }));

  return (
    <SafeAreaView
      style={{
        height: "100%",
        backgroundColor: "#082139",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <View className="goals-container px-4">
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
          Goals
        </Text>
        {!goals || !goalLogs ? (
          <View className="mt-10 flex flex-row justify-center gap-2">
            <ActivityIndicator />
            <Text>Loading goals...</Text>
          </View>
        ) : (
          <FlatList
            contentContainerStyle={{
              paddingBottom: 60,
            }}
            className="mt-6 border-t border-t-[#fff]/10 pt-6"
            data={matchedGoals}
            ItemSeparatorComponent={() => (
              <Separator className="my-4 h-0.5 bg-[#fff]/10" />
            )}
            ListEmptyComponent={() => (
              <Text className="text-center">No goals found for this date.</Text>
            )}
            renderItem={({ item }) => (
              <GoalItem goal={item.goal} goalLogs={item.goalLogs} />
            )}
            keyExtractor={(item) => item.goal._id.toString()}
          />
        )}
      </View>
      <View className="flex-row items-center gap-2 bg-[#0f2336] px-4">
        <CalendarStrip
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
        <Separator className="mr-2" orientation="vertical" />
        <Link href="/goals/create" asChild>
          <Button size="icon" className="h-14 w-14 rounded-full">
            <Plus color="#fff" size={30} />
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}

interface GoalItemProps {
  goal: Doc<"goals">;
  goalLogs: Doc<"goalLogs">[];
}

function GoalItem({ goal, goalLogs }: GoalItemProps) {
  const selectedDateLog = goalLogs && goalLogs.length > 0 ? goalLogs[0] : null;
  const updateGoalLog = useMutation(api.goalLogs.updateGoalLog);

  if (!selectedDateLog) {
    return null;
  }

  const handleLogPress = async (e: GestureResponderEvent) => {
    e.stopPropagation(); // Prevent parent navigation

    if (selectedDateLog.isComplete) {
      Alert.alert("Goal Completed", "This goal has already been completed.");
      return;
    }

    const newUnitsCompleted = (selectedDateLog.unitsCompleted ?? 0) + 1;
    const goalComplete = newUnitsCompleted >= goal.unitValue;

    try {
      // Update the goalLog in the backend with the incremented units
      await updateGoalLog({
        goalLogId: selectedDateLog._id,
        unitsCompleted: newUnitsCompleted,
        isComplete: goalComplete, // Mark complete if it reaches goal value
      });

      if (goalComplete) {
        Alert.alert(
          "Goal Completed",
          `Congratulations! You've completed the goal.`
        );
      }
    } catch (error) {
      console.error("Error updating goal log:", error);
    }
  };

  const IconComp = GOAL_ICONS.find(
    (item) => item.name === goal.selectedIcon
  )?.component;

  const handleTimerRedirect = () => {
    router.push(`/goals/${goal._id}/${selectedDateLog._id}/start`);
  };

  const isCounterUnit = goal.unit === "times";
  const isTimerUnit = ["minutes", "min", "hours"].includes(goal.unit);

  return (
    <View className="flex-row items-center gap-4">
      <Link
        href={{
          pathname: "/goals/[goalId]/[goalLogId]",
          params: {
            goalId: goal._id,
            goalLogId: selectedDateLog._id,
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
              <IconComp
                name={goal.selectedIcon}
                color={goal.selectedIconColor}
                size={32}
              />
            </View>

            <View className="w-full gap-2">
              <Text style={{ fontFamily: "openSans.medium" }}>{goal.name}</Text>
              <Text className="text-xs text-muted-foreground">
                {`${Math.floor(selectedDateLog.unitsCompleted)} / ${Math.floor(goal.unitValue)} ${goal.unit}`}
              </Text>
            </View>
          </View>
        </Pressable>
      </Link>

      {selectedDateLog.isComplete ? (
        // Render green checkmark icon if goal is complete
        <View className="pr-5">
          <FontAwesome5 name="check-circle" size={24} color="green" />
        </View>
      ) : // Render the checkmark with "1" icon only if the goal unit is "times"
      isCounterUnit ? (
        <Button
          className="flex flex-row items-end gap-2 rounded-full bg-gray-600"
          onPress={handleLogPress}
        >
          <FontAwesome5 name="check" size={16} color="white" />
          <Text className="font-bold">1</Text>
        </Button>
      ) : isTimerUnit ? (
        <Button
          onPress={handleTimerRedirect}
          className="flex flex-row items-center gap-2 rounded-full bg-gray-600"
        >
          <MaterialCommunityIcons name="alarm" size={20} color="#fff" />
          <Text className="font-bold">Timer</Text>
        </Button>
      ) : (
        <Button
          className="flex flex-row items-center gap-2 rounded-full bg-gray-600"
          onPress={handleLogPress}
        >
          <FontAwesome5 name="plus-circle" size={16} color="#fff" />
          <Text className="font-bold">Log Progress</Text>
        </Button>
      )}
    </View>
  );
}

function CalendarStrip({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: Date;
  setSelectedDate: Dispatch<SetStateAction<Date>>;
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

import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useMutation, useQuery } from "convex/react";
import { Stack, useLocalSearchParams, router } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Pressable,
  ScrollView,
  View,
} from "react-native";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";
import { fontFamily } from "~/lib/font";
import * as DropdownMenu from "zeego/dropdown-menu";
import { useState } from "react";
import { ArrowRight, Check, ChevronDown, X } from "lucide-react-native";
import { BarChart } from "react-native-chart-kit";
import { StatCard } from "~/components/ui/statCard";
import Calendar from "~/components/ui/calendar";
import { addDays } from "date-fns";
import ToggleSwitch from "~/components/ui/ToggleSwitch";
import { cn, formatDecimalNumber } from "~/lib/utils";

type Modes = "day" | "week" | "month";

const modeLabels: Record<Modes, string> = {
  day: "D",
  week: "W",
  month: "M",
};

const modeOptions: Modes[] = ["day", "week", "month"];

export default function GoalScreen() {
  const { goalId, goalLogId } = useLocalSearchParams<{
    goalId: Id<"goals">;
    goalLogId: Id<"goalLogs">;
  }>();

  // Fetch goal and goal logs
  const goal = useQuery(api.goals.getGoalById, { goalId });
  const goalLog = useQuery(api.goalLogs.getGoalLogById, { goalLogId });
  // const goalLogs = useQuery(api.goalLogs.getGoalLogsbyGoalId, { goalId });
  const habitStats = useQuery(api.singleHabitStats.fetchSingleHabitStats, {
    goalId,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedPeriod, setSelectedPeriod] = useState<Date>(new Date());
  const [modeIndex, setModeIndex] = useState<number>(0);
  const screenWidth = Dimensions.get("window").width;
  const averageLabel = (mode: Modes) => {
    return mode === "day" ? "Daily" : mode === "week" ? "Weekly" : "Monthly";
  };

  const progressData = habitStats?.dailyCompletionRates ?? [];
  const selectedData = () => {
    switch (modeOptions[modeIndex]) {
      case "day":
        return habitStats?.dailyAverageData;
      case "week":
        return habitStats?.weeklyAverageData;
      case "month":
        return habitStats?.monthlyAverageData;
    }
  };

  const chartData = {
    labels: selectedData()?.labels ?? [],
    datasets: [
      {
        data: selectedData()?.data ?? [],
      },
    ],
  };

  const mode = modeOptions[modeIndex];
  const averageValue =
    mode === "day"
      ? habitStats?.dailyAverage
      : mode === "week"
        ? habitStats?.weeklyAverage
        : habitStats?.monthlyAverage;
  const averageUnits = goal?.unit ?? "units";

  const periodSelectorString = (date: Date, mode: Modes) => {
    switch (mode) {
      case "day":
        return date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      case "week":
        return `${date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })} - ${addDays(date, 6).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}`;
      case "month":
        return date.toLocaleDateString("default", {
          month: "long",
          year: "numeric",
        });
    }
  };

  const deleteGoalAndGoalLogs = useMutation(api.goals.deleteGoalAndGoalLogs);

  // const [progress, setProgress] = useState<number>(0);

  // useEffect(() => {
  //   if (goalLogs) {
  //     const totalLogs = goalLogs.length;
  //     const completedLogs = goalLogs.filter((log) => log.isComplete).length;
  //     const percentage = totalLogs > 0 ? (completedLogs / totalLogs) * 100 : 0;
  //     setProgress(percentage);
  //   }
  // }, [goalLogs]);

  const handleDelete = async () => {
    Alert.alert(
      `Are you sure you want to delete ${goal?.name}?`,
      "This action cannot be undone.",
      [
        {
          text: "Yes",
          onPress: async () => {
            router.dismiss(); // Dismiss first, page will break if goal does not exist before exit. Read nonexistent data
            await deleteGoalAndGoalLogs({ goalId });
          },
          style: "destructive",
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleStartGoal = () => {
    router.push({
      pathname: "/goals/[goalId]/[goalLogId]/start",
      params: { goalId, goalLogId },
    });
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
            <Text
              className="text-xl"
              style={{ fontFamily: fontFamily.openSans.bold }}
            >
              {goal ? goal.name : ""}
            </Text>
          ),
          headerBackTitleVisible: false,
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
                      pathname: "/goals/[goalId]/log-history",
                      params: { goalId },
                    })
                  }
                  key="log-history"
                  textValue="Log History"
                >
                  <DropdownMenu.ItemIcon ios={{ name: "keyboard" }} />
                </DropdownMenu.Item>
                <DropdownMenu.Item
                  onSelect={() =>
                    router.navigate({
                      pathname: "/goals/[goalId]/edit",
                      params: { goalId },
                    })
                  }
                  key="edit-goal"
                  textValue="Edit Goal"
                >
                  <DropdownMenu.ItemIcon ios={{ name: "pencil.line" }} />
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item
                  onSelect={handleDelete}
                  destructive
                  key="delete-goal"
                  textValue="Delete Goal"
                >
                  <DropdownMenu.ItemIcon ios={{ name: "trash" }} />
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          ),
        }}
      />
      {!habitStats || !chartData || !goal ? (
        <View className="mt-10 flex flex-row justify-center gap-2">
          <ActivityIndicator />
        </View>
      ) : (
        <View className="gap-4 pb-20">
          <Pressable className="flex flex-row items-center justify-center gap-4 rounded-xl bg-slate-700 p-4">
            <Text className="text-lg font-bold">
              {periodSelectorString(selectedPeriod, mode)}
            </Text>
            <ChevronDown size={24} color="white" />
          </Pressable>

          <View className="flex flex-row items-center gap-4 rounded-xl bg-slate-900 p-6">
            <FontAwesome5 name="fire" size={36} color="#f9a825" />
            <View className="flex flex-col gap-2">
              <Text className="uppercase text-gray-400">Current Streak</Text>
              <Text className="text-xl font-bold">
                {habitStats.currentStreak} Days
              </Text>
            </View>
          </View>

          <View className="gap-4">
            <View className="flex w-full flex-row gap-4">
              <StatCard
                titleIcon={<Check size={16} color="grey" />}
                title="Success"
                value={`${habitStats.successfulDays} Days`}
                comparison={
                  habitStats.successfulDays === 0
                    ? "---"
                    : `${habitStats.successfulDays} Days`
                }
                status={
                  (habitStats.successfulDays ?? 0 > 0) ? "positive" : "neutral"
                }
              />

              <StatCard
                titleIcon={<X size={16} color="grey" />}
                title="Failed"
                value={` Days`}
                comparison={
                  habitStats.failed === 0 ? "---" : `${habitStats.failed} Days`
                }
                status={(habitStats.failed ?? 0 > 0) ? "negative" : "neutral"}
              />
            </View>
            <View className="flex w-full flex-row gap-4">
              <StatCard
                titleIcon={<ArrowRight size={16} color="grey" />}
                title="Skipped"
                value={`${habitStats.skipped} Days`}
                comparison={
                  habitStats.skipped === 0
                    ? "---"
                    : `${habitStats.skipped} Days`
                }
                status={(habitStats.skipped ?? 0 > 0) ? "negative" : "neutral"}
              />

              <StatCard
                title="Total"
                value={`${formatDecimalNumber(habitStats.total ?? 0)} ${goal.unit}`}
                comparison={`${formatDecimalNumber(habitStats.total)} ${goal.unit}`}
                status="positive"
              />
            </View>
          </View>

          <Calendar progressData={progressData} selectedDate={new Date()} />

          <View className="flex flex-col gap-6 rounded-xl bg-slate-900 py-4">
            <View className="px-4">
              <Text className="text-lg uppercase text-gray-500">{`${averageLabel(mode)} Average`}</Text>
              <Text className="text-2xl font-bold">
                {formatDecimalNumber(averageValue)} {averageUnits}
              </Text>
            </View>
            <BarChart
              data={chartData}
              width={screenWidth - 60}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              xLabelsOffset={0}
              fromZero={true}
              chartConfig={{
                backgroundColor: "transparent",
                backgroundGradientFrom: "#0f172a",
                backgroundGradientTo: "#0f172a",
                decimalPlaces: 1,
                color: () => `rgba(120, 120, 255, 1)`,
                labelColor: () => `rgba(255, 255, 255, 1)`,
                fillShadowGradientOpacity: 1,
                propsForBackgroundLines: {
                  stroke: "white",
                  transform: [{ translateX: 75 }],
                },
                propsForLabels: {
                  fill: "ffffff",
                  fontSize: 10,
                },
                barPercentage: modeIndex === 0 ? 0.1 : 1,
              }}
              verticalLabelRotation={0}
            />
            <ToggleSwitch
              currentOption={modeIndex}
              onToggle={(option) => setModeIndex(option)}
              options={Object.values(modeLabels)}
            />
          </View>
          <Pressable
            className={cn(
              "mt-5 items-center rounded-lg p-3",
              goalLog?.isComplete ? "bg-gray-400" : "bg-[#299240]"
            )}
            onPress={goalLog?.isComplete ? null : handleStartGoal}
            disabled={goalLog?.isComplete}
          >
            <Text
              className="text-base text-white"
              style={{ fontFamily: fontFamily.openSans.bold }}
            >
              {goalLog?.isComplete ? "Goal Log Completed" : "Log Progress"}
            </Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );
}

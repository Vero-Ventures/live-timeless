import {
  FlatList,
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Pressable,
} from "react-native";
import HabitStatCard from "../../components/ui/HabitStatCard";
import { fontFamily } from "~/lib/font";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { BarChart } from "react-native-chart-kit";
import { format, subDays, isAfter, isBefore } from "date-fns";
import { Text } from "~/components/ui/text";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as DropdownMenu from "zeego/dropdown-menu";
import type { HabitLog } from "~/convex/habitLogs";

const screenWidth = Dimensions.get("window").width;

const today = new Date();
const year = today.getFullYear();
const month = today.toLocaleString("default", { month: "long" });

const selections = [
  {
    id: "last_7_days",
    label: "Last 7 Days",
    referenceDate: subDays(today, 7),
  },
  {
    id: "last_30_days",
    label: "Last 30 Days",
    referenceDate: subDays(today, 30),
  },
  {
    id: "last_90_days",
    label: "Last 90 Days",
    referenceDate: subDays(today, 90),
  },
  {
    id: "this_week",
    label: "This Week",
    referenceDate: subDays(today, today.getDay() + 1),
  },
  {
    id: `${month.toLowerCase()}_${year}`,
    label: `${month} ${year}`,
    referenceDate: new Date(year, today.getMonth(), 1),
  },
  {
    id: `${year}`,
    label: `${year}`,
    referenceDate: new Date(year, 0, 1),
  },
] as const;

export type Selection = (typeof selections)[number]["id"];

export default function Progress() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    filter?: Selection;
  }>();
  const filter = params.filter ?? "last_7_days";

  const selection =
    selections.find((selection) => selection.id === filter) ?? selections[0];

  // Fetch habit stats and goal logs for the authenticated user
  const habits = useQuery(api.habitStats.fetchHabitStats, {});
  const goalLogs = useQuery(api.goalLogs.listGoalLogs);

  const referenceDate = selection.referenceDate;

  const offset = today.getTimezoneOffset() * 60000;
  const filteredReferenceDate = new Date(referenceDate.getTime() - offset);

  const handleMenuItemPress = (selectionId: Selection) => {
    router.setParams({ filter: selectionId });
  };

  function calculateFilteredCount(fetchedLogs: HabitLog[]): number {
    return fetchedLogs.filter((log) => {
      const logDate = new Date(log.date);
      return (
        isAfter(logDate, filteredReferenceDate) && isBefore(logDate, today)
      );
    }).length;
  }

  const labels = Array.from({ length: 5 }, (_, i) =>
    format(subDays(new Date(), 4 - i), "MMM dd")
  );

  const dailyCompletionRates =
    habits && habits[0]?.dailyCompletionRates
      ? habits[0].dailyCompletionRates
          .slice(-5)
          .map((rate) => rate.completionRate || 0)
      : Array(5).fill(0);

  const overallCompletionRate =
    habits && habits.length
      ? habits.reduce((sum, habit) => sum + (habit.dailyAverage || 0), 0) /
        habits.length
      : 0;

  const chartData = {
    labels,
    datasets: [{ data: dailyCompletionRates }],
  };

  const goalLogsByGoalId =
    goalLogs?.reduce(
      (acc, log) => {
        const goalId = log.goalId.toString();
        if (!acc[goalId]) acc[goalId] = [];
        acc[goalId].push({ date: log.date, isComplete: log.isComplete });
        return acc;
      },
      {} as Record<string, { date: number; isComplete: boolean }[]>
    ) ?? {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#0b1a28" },
          headerShadowVisible: false,
          headerTintColor: "#fff",
          headerTitle: () => (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Pressable
                  className="flex flex-row items-center gap-4"
                  hitSlop={20}
                >
                  <Text className="text-xl font-bold">{selection.label}</Text>
                  <AntDesign name="caretdown" size={20} color="white" />
                </Pressable>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content key="actions">
                {selections.map((selection) => (
                  <DropdownMenu.Item
                    onSelect={() => handleMenuItemPress(selection.id)}
                    key={selection.id}
                    textValue={selection.label}
                  >
                    <DropdownMenu.ItemIcon />
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          ),
          headerBackVisible: false,
        }}
      />
      {!habits ? (
        <View className="mt-10 flex flex-row justify-center gap-2">
          <ActivityIndicator />
          <Text>Loading...</Text>
        </View>
      ) : habits.length === 0 ? (
        <View className="flex-1 justify-center gap-4 p-4">
          <Text className="mt-4 text-center font-medium">
            You have no habits added.
          </Text>
          <Link href="/goals" asChild>
            <Button>
              <Text>Add a habit</Text>
            </Button>
          </Link>
        </View>
      ) : (
        <FlatList
          className="px-4 pt-4"
          data={habits}
          ListHeaderComponent={() => (
            <Card className="mb-4 bg-slate-900 shadow-none">
              <CardHeader className="pb-4">
                <CardDescription
                  className="mb-4"
                  style={{ fontFamily: fontFamily.openSans.semiBold }}
                >
                  Average Completion Rate
                </CardDescription>
                <CardTitle
                  className="text-4xl"
                  style={{ fontFamily: fontFamily.openSans.bold }}
                >
                  {overallCompletionRate.toFixed(1)}%
                </CardTitle>
              </CardHeader>
              <CardContent className="p-1">
                <BarChart
                  data={chartData}
                  width={screenWidth - 60}
                  height={220}
                  yAxisLabel=""
                  yAxisSuffix="%"
                  xLabelsOffset={0}
                  chartConfig={{
                    backgroundColor: "transparent",
                    backgroundGradientFrom: "#0f172a",
                    backgroundGradientTo: "#0f172a",
                    decimalPlaces: 0,
                    color: () => `rgba(120, 120, 255, 1)`,
                    labelColor: () => `rgba(255, 255, 255, 1)`,
                    fillShadowGradientOpacity: 1,
                    propsForBackgroundLines: {
                      stroke: "#ffffff",
                      transform: [{ translateX: 75 }],
                    },
                    propsForLabels: { fill: "#ffffff", fontSize: 10 },
                  }}
                  verticalLabelRotation={0}
                />
              </CardContent>
            </Card>
          )}
          contentContainerStyle={styles.listContentContainer}
          ListEmptyComponent={() => <Text>No habits data available.</Text>}
          renderItem={({ item }) => (
            <HabitStatCard
              name={item.name}
              icon={item.icon}
              iconColor={item.iconColor}
              duration={item.duration}
              longestStreak={item.longestStreak}
              total={parseFloat(item.total.toFixed(1))}
              dailyAverage={parseFloat(item.dailyAverage.toFixed(1))}
              skipped={calculateFilteredCount(item.skipped)}
              failed={calculateFilteredCount(item.failed)}
              goalLogs={goalLogsByGoalId[item._id] || []}
              unit={item.unit}
              selection={selection.id}
            />
          )}
          keyExtractor={(item) => item._id}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#082139" },
  listContentContainer: { paddingBottom: 60 },
});

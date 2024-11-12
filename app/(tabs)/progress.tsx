import React, { useState } from "react";
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
import { Link, Stack } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as DropdownMenu from "zeego/dropdown-menu";
import type { GoalLog } from "~/convex/goalLogs";

const screenWidth = Dimensions.get("window").width;

function Progress() {
  // Fetch habit stats and goal logs for the authenticated user
  const habits = useQuery(api.habitStats.fetchHabitStats, {});
  const goalLogs = useQuery(api.goalLogs.listGoalLogs);

  // Relevent month, year, and today for filter options
  const today = new Date();
  const year = new Date().getFullYear();
  const month = () => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return monthNames[new Date().getMonth()];
  };

  // filter option selections
  const filterSelections = [
    "Last 7 days",
    "Last 30 days",
    "Last 90 days",
    "This Week",
    `${month()} ${year}`,
    `${year}`,
  ];

  const generateFilterReferenceDate = (filterIndex: number) => {
    let referenceDate: Date;

    switch (filterIndex) {
      case 0: // Last 7 days
        referenceDate = subDays(today, 7);
        break;
      case 1: // Last 30 days
        referenceDate = subDays(today, 30);
        break;
      case 2: // Last 90 days
        referenceDate = subDays(today, 90);
        break;
      case 3: // This week
        referenceDate = subDays(today, today.getDay() + 1);
        break;
      case 4: // This month
        referenceDate = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 5: // This year
        referenceDate = new Date(today.getFullYear(), 0, 1);
        break;
      default:
        referenceDate = subDays(today, 29);
        break;
    }

    // Adjust for local time zone
    const offset = today.getTimezoneOffset() * 60000; // Offset in milliseconds
    const localReferenceDate = new Date(referenceDate.getTime() - offset);

    return localReferenceDate;
  };

  // Logic for filter option and selection
  const [filterIndex, setFilterIndex] = useState(0);
  const [filterTitleSelection, setFilterTitleSelection] = useState(
    filterSelections[filterIndex]
  );
  const [filteredReferenceDate, setFilteredReferenceDate] = useState(
    generateFilterReferenceDate(filterIndex)
  );
  const handleMenuItemPress = (index: number) => {
    setFilterTitleSelection(filterSelections[index]);
    setFilterIndex(index);
    setFilteredReferenceDate(generateFilterReferenceDate(index));
  };

  function calculateFilteredCount(fetchedLogs: GoalLog[]): number {
    return fetchedLogs.filter((log) => {
      const logDate = new Date(log.date);
      return (
        isAfter(logDate, filteredReferenceDate) && isBefore(logDate, today)
      );
    }).length;
  }

  const labels = Array.from({ length: 5 }, (_, i) =>
    format(subDays(new Date(), 4 - i), "MMM dd")
  ); // Correct order: oldest to today

  // Extract the last 5 days' completion rates from the first habit's dailyCompletionRates
  const dailyCompletionRates =
    habits && habits[0]?.dailyCompletionRates
      ? habits[0].dailyCompletionRates
          .slice(-5)
          .map((rate) => rate.completionRate || 0)
      : Array(5).fill(0); // Fallback to zeros if data isn't available

  const overallCompletionRate =
    habits && habits.length
      ? habits.reduce((sum, habit) => sum + (habit.dailyAverage || 0), 0) /
        habits.length
      : 0;

  // Bar chart data
  const chartData = {
    labels,
    datasets: [
      {
        data: dailyCompletionRates,
      },
    ],
  };

  // Organize goalLogs by goalId for easy lookup
  const goalLogsByGoalId =
    goalLogs?.reduce(
      (acc, log) => {
        const goalId = log.goalId.toString();
        if (!acc[goalId]) acc[goalId] = [];
        acc[goalId].push({
          date: log.date, // Keep `date` as a timestamp (number)
          isComplete: log.isComplete,
        });
        return acc;
      },
      {} as Record<string, { date: number; isComplete: boolean }[]>
    ) ?? {};

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff",
          headerTitle: () => (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Pressable
                  className="flex flex-row items-center gap-4"
                  hitSlop={20}
                >
                  <Text className="text-xl font-bold">
                    {filterTitleSelection}
                  </Text>
                  <AntDesign name="caretdown" size={20} color="white" />
                </Pressable>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content key="actions">
                {filterSelections.map((selection, index) => (
                  <DropdownMenu.Item
                    onSelect={() => {
                      handleMenuItemPress(index);
                    }}
                    key={selection}
                    textValue={selection}
                  >
                    <DropdownMenu.ItemIcon />
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          ),
          headerBackTitleVisible: false,
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
                  style={{
                    fontFamily: fontFamily.openSans.semiBold,
                  }}
                >
                  Average Completion Rate
                </CardDescription>
                <CardTitle
                  className="text-4xl"
                  style={{
                    fontFamily: fontFamily.openSans.bold,
                  }}
                >
                  {overallCompletionRate.toFixed(1)}%
                </CardTitle>
              </CardHeader>

              <CardContent className="p-1">
                <BarChart
                  data={chartData}
                  width={screenWidth - 60} // Adjusted width to give more space on the right side
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
                    fillShadowGradientOpacity: 1, // Set opacity for the bars (1 for solid color)
                    propsForBackgroundLines: {
                      stroke: "#ffffff", // White grid lines
                      transform: [{ translateX: 75 }], // Shift grid lines to the right
                    },
                    propsForLabels: {
                      fill: "#ffffff",
                      fontSize: 10,
                    },
                  }}
                  verticalLabelRotation={0}
                />
              </CardContent>
            </Card>
          )}
          contentContainerStyle={styles.listContentContainer}
          ListEmptyComponent={() => (
            <Text className="">No habits data available.</Text>
          )}
          renderItem={({ item }) => (
            <HabitStatCard
              name={item.name}
              icon={item.icon} // Pass the icon property
              iconColor={item.iconColor} // Pass the iconColor property
              duration={item.duration}
              longestStreak={item.longestStreak}
              total={parseFloat(item.total.toFixed(1))} // Format total to 1 decimal place
              dailyAverage={parseFloat(item.dailyAverage.toFixed(1))} // Format dailyAverage to 1 decimal place
              skipped={calculateFilteredCount(item.skipped)}
              failed={calculateFilteredCount(item.failed)}
              goalLogs={goalLogsByGoalId[item._id] || []} // Pass goal logs specific to this habit
              unit={item.unit}
              filterIndex={filterIndex}
            />
          )}
          keyExtractor={(item) => item._id}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#082139",
  },
  listContentContainer: {
    paddingBottom: 60,
  },
});

export default Progress;

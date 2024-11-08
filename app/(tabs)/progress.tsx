import React from "react";
import {
  FlatList,
  View,
  SafeAreaView,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import HabitStatCard from "../../components/ui/HabitStatCard";
import { fontFamily } from "~/lib/font";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { BarChart } from "react-native-chart-kit";
import { format, subDays } from "date-fns";
import { Text } from "~/components/ui/text";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Link } from "expo-router";

const screenWidth = Dimensions.get("window").width;

function Progress() {
  // Fetch habit stats and goal logs for the authenticated user
  const habits = useQuery(api.habitStats.fetchHabitStats);
  const goalLogs = useQuery(api.goalLogs.listGoalLogs);

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
      {!habits ? (
        <View className="mt-10 flex flex-row justify-center gap-2">
          <ActivityIndicator />
          <Text>Loading...</Text>
        </View>
      ) : habits.length === 0 ? (
        <View className="flex-1 justify-center gap-4 p-4">
          <Text style={styles.noDataText}>You have no habits added.</Text>
          <Link href="/goals" asChild>
            <Button>
              <Text>Add a habit</Text>
            </Button>
          </Link>
        </View>
      ) : (
        <FlatList
          className="px-4"
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
            <Text style={styles.noDataText}>No habits data available.</Text>
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
              skipped={item.skipped}
              failed={item.failed}
              goalLogs={goalLogsByGoalId[item._id] || []} // Pass goal logs specific to this habit
              unit={item.unit}
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
  noDataText: {
    fontFamily: fontFamily.openSans.medium,
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    marginTop: 20,
  },
});

export default Progress;

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
import { Separator } from "~/components/ui/separator";

const screenWidth = Dimensions.get("window").width;

function Progress() {
  // Use useQuery to fetch habit stats for the authenticated user
  const habits = useQuery(api.habitStats.fetchHabitStats);

  const labels = Array.from({ length: 5 }, (_, i) =>
    format(subDays(new Date(), 4 - i), "MMM dd")
  ); // Correct order: oldest to today

  // Extract the last 5 days' completion rates from the first habit's dailyCompletionRates
  const dailyCompletionRates =
    habits && habits[0]?.dailyCompletionRates
      ? habits[0].dailyCompletionRates
          .slice(-5)
          .map((rate) => rate.completionRate || 0)
      : Array(7).fill(0); // Fallback to zeros if data isn't available

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

  return (
    <SafeAreaView style={styles.safeArea}>
      {!habits ? (
        <View className="mt-10 flex flex-row justify-center gap-2">
          <ActivityIndicator />
          <Text>Loading...</Text>
        </View>
      ) : habits.length === 0 ? (
        <Text style={styles.noDataText}>No habits data available.</Text>
      ) : (
        <FlatList
          className="px-4"
          data={habits}
          ListHeaderComponent={() => (
            <Card className="mb-4 border-input bg-background shadow-none">
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
                  style={{
                    fontFamily: fontFamily.openSans.bold,
                  }}
                >
                  {overallCompletionRate.toFixed(1)}%
                </CardTitle>
              </CardHeader>
              <Separator className="mb-4 bg-input" />
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
                    backgroundGradientFrom: "#082139",
                    backgroundGradientTo: "#082139",
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
              duration={item.duration}
              longestStreak={item.longestStreak}
              total={item.total}
              dailyAverage={item.dailyAverage}
              skipped={item.skipped}
              failed={item.failed}
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
    paddingBottom: 40,
  },
  noDataText: {
    fontFamily: fontFamily.openSans.medium,
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
});

export default Progress;

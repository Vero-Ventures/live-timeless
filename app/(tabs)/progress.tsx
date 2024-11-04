import React from "react";
import {
  FlatList,
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  Dimensions,
} from "react-native";
import HabitStatCard from "../../components/ui/HabitStatCard";
import { fontFamily } from "~/lib/font";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { BarChart } from "react-native-chart-kit";
import { format, subDays } from "date-fns";

const screenWidth = Dimensions.get("window").width;

const Progress: React.FC = () => {
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

  if (!habits) return <Text style={styles.loadingText}>Loading...</Text>;
  if (habits.length === 0)
    return <Text style={styles.noDataText}>No habits data available.</Text>;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Display Overall Completion Rate */}
        <Text style={styles.title}>
          Avg Completion: {overallCompletionRate.toFixed(1)}%
        </Text>

        {/* Display Bar Chart for Daily Completion Rates */}
        <View style={styles.chartWrapper}>
          <BarChart
            data={chartData}
            width={screenWidth - 40} // Adjusted width to give more space on the right side
            height={220}
            yAxisLabel=""
            yAxisSuffix="%"
            xLabelsOffset={0}
            chartConfig={{
              backgroundColor: "transparent",
              backgroundGradientFrom: "#1E202B",
              backgroundGradientTo: "#1E202B",
              decimalPlaces: 1,
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
            style={styles.chart}
          />
        </View>

        {/* List of Habit Stats - Displayed below the Bar Chart */}
        <FlatList
          data={habits}
          contentContainerStyle={styles.listContentContainer}
          ListEmptyComponent={() => (
            <Text style={styles.noDataText}>No habits data available.</Text>
          )}
          renderItem={({ item }) => (
            <View style={styles.cardWrapper}>
              <HabitStatCard
                name={item.name}
                icon={item.icon} // Pass the icon property
                iconColor={item.iconColor} // Pass the iconColor property
                duration={item.duration}
                longestStreak={item.longestStreak}
                total={item.total}
                dailyAverage={item.dailyAverage}
                skipped={item.skipped}
                failed={item.failed}
                completionData={item.dailyCompletionRates.map((rate) => ({
                  date: rate.date,
                  count: rate.completionRate,
                }))}
              />
            </View>
          )}
          keyExtractor={(item) => item._id}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#082139",
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#082139",
  },
  title: {
    fontFamily: fontFamily.openSans.bold,
    fontSize: 24,
    color: "#ffffff",
    marginBottom: 16,
  },
  chartWrapper: {
    marginBottom: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ffffff",
    paddingHorizontal: 3,
    paddingVertical: 5,
  },
  chart: {
    paddingRight: 55,
  },
  listContentContainer: {
    paddingBottom: 60,
  },
  cardWrapper: {
    backgroundColor: "#0e2942",
    borderRadius: 8,
    marginBottom: 10,
    padding: 16,
  },
  loadingText: {
    fontFamily: fontFamily.openSans.medium,
    fontSize: 16,
    color: "#ffffff",
    textAlign: "center",
    marginTop: 20,
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

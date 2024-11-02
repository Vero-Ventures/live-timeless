// app/tabs/Progress.tsx

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
import { HabitStat } from "../../convex/fetchHabitStats";
import { fontFamily } from "~/lib/font";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { BarChart } from "react-native-chart-kit";
import { format, subDays } from "date-fns";

const screenWidth = Dimensions.get("window").width;

const Progress: React.FC = () => {
  // Use useQuery to fetch habit stats for the authenticated user
  const habits = useQuery(api.fetchHabitStats.fetchHabitStats);

  const labels = Array.from({ length: 7 }, (_, i) =>
    format(subDays(new Date(), 6 - i), "MMM dd")
  ); // Correct order: oldest to today

  // Extract the last 7 days' completion rates from the first habit's dailyCompletionRates
  const dailyCompletionRates =
    habits && habits[0]?.dailyCompletionRates
      ? habits[0].dailyCompletionRates
          .slice(-7)
          .map((rate) => rate.completionRate || 0)
      : Array(7).fill(0); // Fallback to zeros if data isn't available

  console.log("Daily Completion Rates for Chart:", dailyCompletionRates);

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
        <Text style={styles.title}>
          Progress - Avg Completion: {overallCompletionRate.toFixed(1)}%
        </Text>

        <BarChart
          data={chartData}
          width={screenWidth - 32}
          height={220}
          yAxisLabel=""
          yAxisSuffix="%"
          chartConfig={{
            backgroundColor: "#1E2923",
            backgroundGradientFrom: "#1E2923",
            backgroundGradientTo: "#08130D",
            decimalPlaces: 1,
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
          }}
          verticalLabelRotation={0}
          style={styles.chart}
        />

        {/* List of Habit Stats */}
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
                duration={item.duration}
                longestStreak={item.longestStreak}
                total={item.total}
                dailyAverage={item.dailyAverage}
                skipped={item.skipped}
                failed={item.failed}
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
  chart: {
    marginBottom: 16,
    borderRadius: 8,
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

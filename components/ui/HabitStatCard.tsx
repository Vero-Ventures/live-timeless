import React from "react";
import { View, Text, StyleSheet } from "react-native";
// @ts-ignore
import CalendarHeatmap from "react-native-calendar-heatmap";

interface HabitStatCardProps {
  name: string;
  duration: string;
  longestStreak: number;
  total: number;
  dailyAverage: number;
  skipped: number;
  failed: number;
  completionData: { date: string; count: number }[]; // Data format for the heatmap
}

const HabitStatCard: React.FC<HabitStatCardProps> = ({
  name,
  duration,
  longestStreak,
  total,
  dailyAverage,
  skipped,
  failed,
  completionData,
}) => {
  // Prepare padded data for 11-11-8 layout
  const paddedCompletionData = [
    { date: "2024-10-01", count: 0 }, // Empty cell for padding
    { date: "2024-10-02", count: 0 },
    ...completionData.slice(0, 11), // First 11 days
    { date: "2024-10-13", count: 0 }, // Empty cell for padding
    { date: "2024-10-14", count: 0 },
    ...completionData.slice(11, 22), // Next 11 days
    { date: "2024-10-25", count: 0 }, // Empty cell for padding
    { date: "2024-10-26", count: 0 },
    { date: "2024-10-27", count: 0 },
    ...completionData.slice(22, 30), // Last 8 days
  ];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.duration}>{duration}</Text>
      </View>

      {/* Heatmap */}
      <View style={styles.heatmap}>
        <CalendarHeatmap
          endDate={new Date()}
          numDays={30}
          values={paddedCompletionData}
          showMonthLabels={false}
          showOutOfRangeDays={false}
          gutterSize={2}
          horizontal={true}
          squareSize={14}
          colors={["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"]} // Color range
        />
      </View>

      <View style={styles.stats}>
        <View style={styles.statRow}>
          <Text style={styles.icon}>🔥</Text>
          <Text style={styles.label}>Longest Streak:</Text>
          <Text style={styles.value}>{longestStreak} days</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.icon}>∞</Text>
          <Text style={styles.label}>Total:</Text>
          <Text style={styles.value}>{total} mins</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.icon}>📅</Text>
          <Text style={styles.label}>Daily Average:</Text>
          <Text style={styles.value}>{dailyAverage} mins</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.icon}>⏭️</Text>
          <Text style={styles.label}>Skipped:</Text>
          <Text style={styles.value}>{skipped} days</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.icon}>❌</Text>
          <Text style={styles.label}>Failed:</Text>
          <Text style={styles.value}>{failed} days</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    marginVertical: 10,
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
  },
  duration: {
    fontSize: 14,
    color: "#4CAF50",
  },
  heatmap: {
    marginVertical: 10,
  },
  stats: {
    marginTop: 10,
  },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  icon: {
    fontSize: 18,
    width: 24,
    color: "#ffffff",
  },
  label: {
    fontSize: 14,
    color: "#cccccc",
    flex: 1,
    paddingLeft: 8,
  },
  value: {
    fontSize: 14,
    color: "#ffffff",
  },
});

export default HabitStatCard;

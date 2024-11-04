import React from "react";
import { View, Text, StyleSheet } from "react-native";
// @ts-ignore
import CalendarHeatmap from "react-native-calendar-heatmap";
import { subDays, format } from "date-fns";
import { GOAL_ICONS } from "~/constants/goal-icons"; // Import the icon constants

interface HabitStatCardProps {
  name: string;
  icon: string; // This will be `selectedIcon` from the database
  iconColor: string; // This will be `selectedIconColor` from the database
  duration: string;
  longestStreak: number;
  total: number;
  dailyAverage: number;
  skipped: number;
  failed: number;
  completionData: { date: string; count: number }[]; // Data format for the heatmap
}

// Helper function to generate the past 30 days in an 11-11-8 layout
const generatePaddedCompletionData = (
  completionData: { date: string; count: number }[]
) => {
  const today = new Date();

  // Generate past 30 dates starting from today
  const past30Days = Array.from({ length: 30 }, (_, i) => {
    const date = subDays(today, i);
    return {
      date: format(date, "yyyy-MM-dd"),
      count: 0, // Default count of 0 (you can update this based on actual data below)
    };
  }).reverse(); // Reverse to get dates in ascending order
  // Update counts based on actual completionData
  const mappedData = past30Days.map((day) => {
    const matchingData = completionData.find((d) => d.date === day.date);
    return {
      ...day,
      count: matchingData ? matchingData.count : 0, // Use count from completionData if available
    };
  });
  // Split into 11-11-8 layout with padding cells as needed
  const paddedCompletionData = [
    { date: "", count: 0 }, // Empty padding cell
    { date: "", count: 0 },
    ...mappedData.slice(0, 11), // First 11 days
    { date: "", count: 0 }, // Empty padding cell
    { date: "", count: 0 },
    ...mappedData.slice(11, 22), // Next 11 days
    { date: "", count: 0 }, // Empty padding cells
    { date: "", count: 0 },
    { date: "", count: 0 },
    ...mappedData.slice(22, 30), // Last 8 days
  ];
  return paddedCompletionData;
};

const HabitStatCard: React.FC<HabitStatCardProps> = ({
  name,
  icon,
  iconColor,
  duration,
  longestStreak,
  total,
  dailyAverage,
  skipped,
  failed,
  completionData,
}) => {
  // Generate padded data for the past 30 days
  const paddedCompletionData = generatePaddedCompletionData(completionData);

  // Find the matching icon component from GOAL_ICONS
  const IconComponent = GOAL_ICONS.find(
    (item) => item.name === icon
  )?.component;

  return (
    <View style={styles.card}>
      {/* Header Section with Habit Title, Duration, and Icon */}
      <View style={styles.headerSection}>
        <View style={styles.titleAndDuration}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.duration}>{duration}</Text>
        </View>
        {IconComponent ? (
          <IconComponent name={icon} color={iconColor} size={32} />
        ) : (
          <Text style={[styles.icon, { color: iconColor }]}>{icon}</Text> // Fallback if icon is not found
        )}
      </View>

      {/* Heatmap */}
      <CalendarHeatmap
        endDate={new Date()}
        numDays={30} // Show the past 30 days
        values={paddedCompletionData}
        showMonthLabels={false}
        showOutOfRangeDays={false}
        gutterSize={2}
        squareSize={12} // Increase square size to help fill the space
        horizontal={true} // Ensure a horizontal layout
        colors={["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"]}
      />

      {/* Stats */}
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
  headerSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  titleAndDuration: {
    flexDirection: "column",
    justifyContent: "center",
    flex: 1,
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
    alignItems: "center",
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

import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface HabitStatCardProps {
  name: string;
  duration: string;
  longestStreak: number;
  total: number;
  dailyAverage: number;
  skipped: number;
  failed: number;
}

const HabitStatCard: React.FC<HabitStatCardProps> = ({
  name,
  duration,
  longestStreak,
  total,
  dailyAverage,
  skipped,
  failed,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.duration}>{duration}</Text>
      </View>
      <View style={styles.stats}>
        <Text style={styles.stat}>
          <Text style={styles.label}>🔥 Longest Streak:</Text> {longestStreak}{" "}
          days
        </Text>
        <Text style={styles.stat}>
          <Text style={styles.label}>∞ Total:</Text> {total} mins
        </Text>
        <Text style={styles.stat}>
          <Text style={styles.label}>📅 Daily Average:</Text> {dailyAverage}{" "}
          mins
        </Text>
        <Text style={styles.stat}>
          <Text style={styles.label}>⏭️ Skipped:</Text> {skipped} days
        </Text>
        <Text style={styles.stat}>
          <Text style={styles.label}>❌ Failed:</Text> {failed} days
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 10,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  header: {
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  duration: {
    fontSize: 14,
    color: "#666",
  },
  stats: {
    marginTop: 10,
  },
  stat: {
    fontSize: 14,
    marginBottom: 5,
  },
  label: {
    fontWeight: "bold",
  },
});

export default HabitStatCard;

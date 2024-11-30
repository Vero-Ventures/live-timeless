import React from "react";
import { View, Text, StyleSheet } from "react-native";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
} from "date-fns";
import Svg, { Circle } from "react-native-svg";

interface CalendarProps {
  progressData: number[];
  selectedDate: Date;
}

const Calendar = ({ progressData, selectedDate }: CalendarProps) => {
console.log("progressData", progressData);
  const startDate = startOfMonth(selectedDate);
  const endDate = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const firstDayOfMonth = getDay(startDate);

  return (
    <View style={styles.container}>
      {/* Days of the Week */}
      <View style={styles.weekdays}>
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <Text key={index} style={styles.weekday} className="text-gray-500">
            {day}
          </Text>
        ))}
      </View>

      {/* Calendar Days */}
      <View style={styles.days}>
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <View key={`empty-${index}`} style={styles.dayContainer} />
        ))}
        {days.map((day) => {
          const dayNumber = format(day, "d"); // Get day of the month
          const index = day.getDate() - 1; // Get index for progress data
          const progress = progressData[index]; // Default to 0 if no data
          return (
            <View key={`${index}`} style={styles.dayContainer}>
              {progress === null ? (
                <View style={styles.emptyCircle} />
              ) : progress > 0 ? (
                <Svg height="40" width="40" viewBox="0 0 40 40">
                  <Circle
                    cx="20"
                    cy="20"
                    r="18"
                    stroke="#0D451E"
                    strokeWidth="4"
                    fill="none"
                  />
                  <Circle
                    cx="20"
                    cy="20"
                    r="18"
                    stroke="lightgreen"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${(progress * 113) / 100}, 113`}
                    strokeLinecap="round"
                    rotation="-90"
                    origin="20, 20"
                  />
                </Svg>
              ) : progress === 0 ? (
                <Svg height="40" width="40" viewBox="0 0 40 40">
                  <Circle
                    cx="20"
                    cy="20"
                    r="18"
                    stroke="#0D451E"
                    strokeWidth="4"
                    fill="none"
                  />
                </Svg>
              ) : (
                <View style={styles.emptyCircle} />
              )}
              <Text
                style={[
                  styles.dayNumber,
                  { color: progress !== null && progress > 0 ? "white" : "gray" },
                ]}
              >
                {dayNumber}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  weekdays: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  weekday: {
    width: "14.28%", // Each weekday takes up 1/7 of the width
    textAlign: "center",
    fontWeight: "bold",
  },
  days: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  dayContainer: {
    width: "14.28%", // Each day takes up 1/7 of the width
    alignItems: "center",
    marginBottom: 10,
  },
  emptyCircle: {
    width: 40,
    height: 40,
  },
  dayNumber: {
    position: "absolute",
    fontSize: 16,
    fontWeight: "bold",
    top: 10,
  },
});

export default Calendar;

import React from "react";
import { View } from "react-native";
import { Text } from "./text";
import {
  Card,
  CardContent,
} from "./card";
import { fontFamily } from "~/lib/font";
import { Calendar } from "~/lib/icons/Calendar";
import { ArrowRight } from "~/lib/icons/ArrowRight";
import { Flame } from "~/lib/icons/Flame";
import { Infinity } from "~/lib/icons/Infinity";
import { X } from "~/lib/icons/X";
import { Separator } from "./separator";
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
    ...mappedData.slice(0, 11), // First 11 days
    ...mappedData.slice(11, 22), // Next 11 days
    ...mappedData.slice(22, 30), // Last 8 days
  ];
  return paddedCompletionData;
};

function HabitStatCard({
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
}: HabitStatCardProps) {
  // Generate padded data for the past 30 days
  const paddedCompletionData = generatePaddedCompletionData(completionData);

  // Find the matching icon component from GOAL_ICONS
  const IconComponent = GOAL_ICONS.find(
    (item) => item.name === icon
  )?.component;

  return (
    <Card className="border-input bg-background shadow-none">
      {/* Top Section with Icon, Title, and Duration */}
      <View className="flex-row items-center justify-between p-4">
        <View className="flex-1">
          <Text
            style={{
              fontFamily: fontFamily.openSans.bold,
              fontSize: 18,
              color: "#ffffff",
            }}
          >
            {name}
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.openSans.regular,
              fontSize: 14,
              color: "#ffffff",
            }}
          >
            {duration}
          </Text>
        </View>
        {/* Icon on the right side */}
        {!!IconComponent && <IconComponent name={icon} color={iconColor} size={32} />}
      </View>

      {/* Heatmap Section */}
      <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        <CalendarHeatmap
          endDate={new Date()}
          numDays={30}
          values={paddedCompletionData}
          showMonthLabels={false}
          showOutOfRangeDays={false}
          gutterSize={2}
          squareSize={14}
          horizontal={true} // Set to false to display in rows
          colors={["#ebedf0", "#c6e48b", "#7bc96f", "#239a3b", "#196127"]}
        />
      </View>

      {/* Separator */}
      <Separator className="mb-4 bg-input" />

      {/* Stats Section */}
      <CardContent className="p-0 pb-6">
        <View className="flex-row justify-between px-6 pb-4">
          <View className="flex flex-row items-center gap-2">
            <Flame size={20} className="text-muted-foreground" />
            <Text className="font-bold">Longest Streak:</Text>
          </View>
          <Text>{longestStreak} days</Text>
        </View>
        <Separator className="mb-4 bg-input" />
        <View className="flex-row justify-between px-6 pb-4">
          <View className="flex flex-row items-center gap-2">
            <Infinity size={20} className="text-muted-foreground" />
            <Text className="font-bold">Total:</Text>
          </View>
          <Text>{total} mins</Text>
        </View>
        <Separator className="mb-4 bg-input" />
        <View className="flex-row justify-between px-6 pb-4">
          <View className="flex flex-row items-center gap-2">
            <Calendar size={20} className="text-muted-foreground" />
            <Text className="font-bold">Daily Average:</Text>
          </View>
          <Text>{dailyAverage.toFixed(1)} mins</Text>
        </View>
        <Separator className="mb-4 bg-input" />
        <View className="flex-row justify-between px-6 pb-4">
          <View className="flex flex-row items-center gap-2">
            <ArrowRight size={20} className="text-muted-foreground" />
            <Text className="font-bold">Skipped:</Text>
          </View>
          <Text>{skipped} days</Text>
        </View>
        <Separator className="mb-4 bg-input" />
        <View className="flex-row justify-between px-6">
          <View className="flex flex-row items-center gap-2">
            <X size={20} className="text-muted-foreground" />
            <Text className="font-bold">Failed:</Text>
          </View>
          <Text>{failed} days</Text>
        </View>
      </CardContent>
    </Card>
  );
}

export default HabitStatCard;

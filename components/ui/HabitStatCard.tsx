import React from "react";
import { View } from "react-native";
import { Text } from "./text";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./card";
import { fontFamily } from "~/lib/font";
import { Calendar } from "~/lib/icons/Calendar";
import { ArrowRight } from "~/lib/icons/ArrowRight";
import { Flame } from "~/lib/icons/Flame";
import { Infinity } from "~/lib/icons/Infinity";
import { X } from "~/lib/icons/X";
import { Separator } from "./separator";
import { startOfDay, subDays } from "date-fns";
import { GOAL_ICONS } from "~/constants/goal-icons";
import { cn } from "~/lib/utils";

interface HabitStatCardProps {
  name: string;
  icon: string;
  iconColor: string;
  duration: string;
  longestStreak: number;
  total: number;
  dailyAverage: number;
  skipped: number;
  failed: number;
  goalLogs: { date: number; isComplete: boolean }[]; // Accept goalLogs with date as number (timestamp) and isComplete as boolean
  unit: string;
}

// Adjusted function to generate completion data based on daily matching
const generateCompletionData = (
  goalLogs: { date: number; isComplete: boolean }[]
) => {
  const days = 7;
  const today = new Date();

  // Generate past 7 days in normalized day format
  const pastDays = Array.from({ length: days }, (_, i) => {
    const date = startOfDay(subDays(today, i)).getTime(); // Normalize each past day to start of day timestamp

    // Find if there's a log for this day and if it is marked complete
    const logForDay = goalLogs.find(
      (log) => startOfDay(new Date(log.date)).getTime() === date // Normalize log date to start of day and compare
    );

    const isComplete = logForDay ? logForDay.isComplete : false;

    const dayData = { date, isComplete };
    console.log("Heatmap Day Data:", dayData); // Log each day's data for debugging
    return dayData;
  }).reverse();

  console.log("Final Heatmap Data for Past 7 Days:", pastDays); // Log full array for verification
  return pastDays;
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
  goalLogs,
  unit,
}: HabitStatCardProps) {
  // Generate the heatmap data using the completion status in goalLogs
  const data = generateCompletionData(goalLogs);

  console.log("Data passed to HabitStatCard for heatmap rendering:", data); // Log heatmap data

  // Find the matching icon component from GOAL_ICONS
  const iconComponent = GOAL_ICONS.find((item) => item.name === icon);
  const Icon = iconComponent?.component;

  return (
    <Card className="mb-4 bg-slate-900 shadow-none">
      <CardHeader className="flex-row items-center justify-between pb-4">
        <View>
          <CardTitle
            style={{
              fontFamily: fontFamily.openSans.bold,
            }}
          >
            {name}
          </CardTitle>
          <CardDescription
            style={{
              fontFamily: fontFamily.openSans.regular,
            }}
          >
            {duration}
          </CardDescription>
        </View>
        {!!icon && <Icon name={icon} color={iconColor} size={32} />}
      </CardHeader>
      <CardContent className="p-0 pb-6">
        <View className="mb-5 items-center">
          <View className="flex-row gap-0.5">
            {data.map((value) => (
              <View
                key={String(value.date)}
                className={cn("h-12 w-12", {
                  "bg-slate-800": !value.isComplete, // Not completed
                  "bg-blue-500": value.isComplete, // Completed
                })}
              ></View>
            ))}
          </View>
        </View>
        <View className="flex-row justify-between px-6 py-4">
          <View className="flex flex-row items-center gap-2">
            <Flame size={20} className="text-muted-foreground" />
            <Text className="font-bold">Longest Streak:</Text>
          </View>
          <Text>{longestStreak} days</Text>
        </View>
        <Separator className="mb-4 bg-slate-800" />
        <View className="flex-row justify-between px-6 pb-4">
          <View className="flex flex-row items-center gap-2">
            <Infinity size={20} className="text-muted-foreground" />
            <Text className="font-bold">Total:</Text>
          </View>
          <Text>
            {total} {unit}
          </Text>
        </View>
        <Separator className="mb-4 bg-slate-800" />
        <View className="flex-row justify-between px-6 pb-4">
          <View className="flex flex-row items-center gap-2">
            <Calendar size={20} className="text-muted-foreground" />
            <Text className="font-bold">Daily Average:</Text>
          </View>
          <Text>
            {dailyAverage.toFixed(1)} {unit}
          </Text>
        </View>
        <Separator className="mb-4 bg-slate-800" />
        <View className="flex-row justify-between px-6 pb-4">
          <View className="flex flex-row items-center gap-2">
            <ArrowRight size={20} className="text-muted-foreground" />
            <Text className="font-bold">Skipped:</Text>
          </View>
          <Text>{skipped} days</Text>
        </View>
        <Separator className="mb-4 bg-slate-800" />
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

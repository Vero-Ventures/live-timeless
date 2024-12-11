import React from "react";
import { View } from "react-native";
import { Text } from "../ui/text";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Calendar } from "~/lib/icons/Calendar";
import { ArrowRight } from "~/lib/icons/ArrowRight";
import { Flame } from "~/lib/icons/Flame";
import { Infinity } from "~/lib/icons/Infinity";
import { X } from "~/lib/icons/X";
import { Separator } from "../ui/separator";
import { startOfDay, subDays } from "date-fns";
import { HABIT_ICONS } from "~/constants/habit-icons";
import { cn } from "~/lib/utils";
// import type { Selection } from "~/app/(tabs)/progress";

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
  habitLogs: { date: number; isComplete: boolean }[]; // Accept habitLogs with date as number (timestamp) and isComplete as boolean
  unit: string;
  selection: Selection;
}

const today = new Date();
const year = today.getFullYear();
const month = today.toLocaleString("default", { month: "long" });

const constants: Record<Selection, number> = {
  last_7_days: 7,
  last_30_days: 30,
  last_90_days: 90,
  this_week: 7,
};

constants[`${month.toLowerCase()}_${year}`] = 30;
constants[`${year}`] = 365;

// Adjusted function to generate completion data based on daily matching
const generateCompletionData = (
  habitLogs: { date: number; isComplete: boolean }[],
  selection: Selection
) => {
  const days = constants[selection];

  // Generate past days in normalized day format
  const pastDays = Array.from({ length: days }, (_, i) => {
    const date = startOfDay(subDays(today, i)).getTime(); // Normalize each past day to start of day timestamp

    // Find if there's a log for this day and if it is marked complete
    const logForDay = habitLogs.find(
      (log) => startOfDay(new Date(log.date)).getTime() === date // Normalize log date to start of day and compare
    );

    const isComplete = logForDay ? logForDay.isComplete : false;

    const dayData = { date, isComplete };

    return dayData;
  }).reverse();

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
  habitLogs,
  unit,
  selection,
}: HabitStatCardProps) {
  // Generate the heatmap data using the completion status in habitLogs
  const data = generateCompletionData(habitLogs, selection);

  const iconComponent = HABIT_ICONS.find((item) => item.name === icon);
  const Icon = iconComponent?.component;

  return (
    <Card className="mb-4 bg-slate-900 shadow-none">
      <CardHeader className="flex-row items-center justify-between pb-4">
        <View>
          <CardTitle>{name}</CardTitle>
          <CardDescription>{duration}</CardDescription>
        </View>
        {!!icon && <Icon name={icon} color={iconColor} size={32} />}
      </CardHeader>
      <CardContent className="p-0 pb-6">
        <View className="mx-auto flex flex-row flex-wrap items-center gap-0.5 p-4">
          {data.map((value) => (
            <View
              key={value.date.toLocaleString()}
              className={cn({
                "h-[46px] w-[46px]":
                  selection === "last_7_days" || selection === "this_week",
                "h-10 w-10":
                  selection === "last_30_days" ||
                  selection === `${month} ${year}`,
                "h-8 w-8": selection === "last_90_days",
                "h-4 w-4": selection === `${year}`,
                "bg-slate-800": !value.isComplete,
                "bg-blue-500": value.isComplete,
              })}
            ></View>
          ))}
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

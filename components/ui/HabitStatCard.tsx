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
import { subDays, format } from "date-fns";
import { GOAL_ICONS } from "~/constants/goal-icons"; // Import the icon constants
import { cn } from "~/lib/utils";

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
  unit: string;
}

// Helper function to generate the past x days in a 7-day layout, including today
const generateCompletionData = (
  completionData: { date: string; count: number }[]
) => {
  const days = 7;
  const today = new Date();

  // Generate the past 7 days, including today
  const pastDays = Array.from({ length: days }, (_, i) => {
    const date = subDays(today, i);
    return {
      date: format(date, "yyyy-MM-dd"), // Format as YYYY-MM-DD for consistency
      count: 0,
    };
  }).reverse();

  // Map completion data to ensure counts reflect `isComplete` status
  const mappedData = pastDays.map((day) => {
    const matchingData = completionData.find((d) => d.date === day.date);
    return {
      day: day.date,
      count: matchingData ? matchingData.count : 0,
    };
  });

  return mappedData;
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
  unit,
}: HabitStatCardProps) {
  // Generate padded data for the past 7 days
  const data = generateCompletionData(completionData);

  // Find the matching icon component from GOAL_ICONS
  const iconComponent = GOAL_ICONS.find((item) => item.name === icon);
  const Icon = iconComponent?.component;

  return (
    <Card className="mb-4 border-input bg-background shadow-none">
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
      <Separator className="mb-4 bg-input" />
      <CardContent className="p-0 pb-6">
        <View className="mb-5 items-center">
          {/* <ContributionGraph
            endDate={new Date()}
            showMonthLabels={false}
            tooltipDataAttrs={(v) => {
              return {
                fill: v.value > 1 ? "rgba(120, 120, 255)" : "rgb(43, 56, 100)",
              };
            }}
            values={data}
            horizontal={false}
            numDays={7}
            squareSize={40}
            width={screenWidth - 30}
            height={40}
            chartConfig={{
              backgroundColor: "transparent",
              backgroundGradientFrom: "#082139",
              backgroundGradientTo: "#082139",
              color: () => `rgba(120, 120, 255, 1)`,
              labelColor: () => `rgba(255, 255, 255, 1)`,
              fillShadowGradientOpacity: 1, // Set opacity for the bars (1 for solid color)
              propsForLabels: {
                fill: "#ffffff",
                fontSize: 10,
              },
            }}
          /> */}
          <View className="flex-row gap-0.5">
            {completionData.map((value) => (
              <View
                key={String(value.date)}
                className={cn("h-12 w-12", {
                  "bg-slate-800": value.count === 0,
                  "bg-blue-500": value.count > 1,
                })}
              ></View>
            ))}
          </View>
        </View>
        <Separator className="mb-4 bg-input" />
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
          <Text>
            {total} {unit}
          </Text>
        </View>
        <Separator className="mb-4 bg-input" />
        <View className="flex-row justify-between px-6 pb-4">
          <View className="flex flex-row items-center gap-2">
            <Calendar size={20} className="text-muted-foreground" />
            <Text className="font-bold">Daily Average:</Text>
          </View>
          <Text>
            {dailyAverage.toFixed(1)} {unit}
          </Text>
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

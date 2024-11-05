import React from "react";
import { Dimensions, View } from "react-native";
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
import { ContributionGraph } from "react-native-chart-kit";

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

const screenWidth = Dimensions.get("window").width;

// Helper function to generate the past x days in an 11-11-8 layout
const generateCompletionData = (
  completionData: { date: string; count: number }[],
  days: number
) => {
  const today = new Date();

  // Generate past dates starting from today
  const pastDays = Array.from({ length: days }, (_, i) => {
    const date = subDays(today, i);
    return {
      date: format(date, "yyyy-MM-dd"),
      count: 0, // Default count of 0 (you can update this based on actual data below)
    };
  }).reverse(); // Reverse to get dates in ascending order

  // Update counts based on actual completionData
  const mappedData = pastDays.map((day) => {
    const matchingData = completionData.find((d) => d.date === day.date);
    return {
      day: day.date,
      count: matchingData ? matchingData.count : 0, // Use count from completionData if available
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
}: HabitStatCardProps) {
  // Generate padded data for the past 7 days
  const data = generateCompletionData(completionData, 7);

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
          <ContributionGraph
            endDate={new Date()}
            showMonthLabels={false}
            tooltipDataAttrs={(v) => {
              return {
                fill:
                  v.value === 0 ? "rgba(120, 120, 255)" : "rgb(43, 56, 100)",
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
          />
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

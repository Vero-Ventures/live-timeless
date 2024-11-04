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

interface HabitStatCardProps {
  name: string;
  duration: string;
  longestStreak: number;
  total: number;
  dailyAverage: number;
  skipped: number;
  failed: number;
}

function HabitStatCard({
  name,
  duration,
  longestStreak,
  total,
  dailyAverage,
  skipped,
  failed,
}: HabitStatCardProps) {
  return (
    <Card className="border-input bg-background shadow-none">
      <CardHeader className="pb-4">
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
      </CardHeader>
      <Separator className="mb-4 bg-input" />
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

import { Stack, useLocalSearchParams } from "expo-router";
import { View, ActivityIndicator, FlatList } from "react-native";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { fontFamily } from "~/lib/font";
import { format, isToday, isYesterday } from "date-fns";
import type { Id } from "~/convex/_generated/dataModel";
import type { FunctionReturnType } from "convex/server";
import { GOAL_ICONS } from "~/constants/goal-icons";
import { Text } from "~/components/ui/text";

type LogType = FunctionReturnType<
  typeof api.goalLogs.getGoalLogsbyGoalId
>[number];

function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d, yyyy");
}

export default function LogHistoryPage() {
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const goalLogs = useQuery(api.goalLogs.getGoalLogsbyGoalId, {
    goalId: goalId as Id<"goals">,
  });

  console.log(JSON.stringify(goalLogs, null, 4));

  if (!goalLogs) {
    return (
      <View
        className="flex-1 items-center justify-center gap-4"
        style={{
          backgroundColor: "#082139",
        }}
      >
        <ActivityIndicator size="large" color="#ffffff" />
        <Text>Loading log history...</Text>
      </View>
    );
  }

  const filteredLogs = goalLogs.filter((log) => log.unitsCompleted > 0);

  const logsByDate = filteredLogs.reduce(
    (acc, log) => {
      const date = formatDate(log.date);
      if (!acc[date]) acc[date] = [];
      acc[date].push(log);
      return acc;
    },
    {} as Record<string, LogType[]>
  );

  return (
    <View className="flex-1 pt-4" style={{ backgroundColor: "#082139" }}>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff",
          headerTitle: () => (
            <Text className="text-xl font-bold">Log History</Text>
          ),
          headerBackTitleVisible: false,
        }}
      />
      <FlatList
        data={Object.keys(logsByDate)}
        keyExtractor={(date) => date}
        renderItem={({ item: date }) => (
          <View className="mb-4">
            {/* Date Header */}
            <Text className="mb-2 pl-4 font-bold">{date}</Text>
            {/* Log Entries for this date */}
            {logsByDate[date].map((log) => (
              <LogItem key={log._id} log={log} />
            ))}
          </View>
        )}
        ListEmptyComponent={() => (
          <Text
            style={{
              fontFamily: fontFamily.openSans.medium,
              color: "#ffffff",
              fontSize: 16,
              textAlign: "center",
              marginTop: 20,
            }}
          >
            No log history available.
          </Text>
        )}
      />
    </View>
  );
}

function LogItem({ log }: { log: LogType }) {
  const icon = GOAL_ICONS.find((icon) => icon.name === log.goal?.selectedIcon);
  const Icon = icon?.component;
  const iconName = icon?.name;
  const iconColor = log.goal?.selectedIconColor;

  return (
    <View className="mb-2 flex flex-row items-center justify-between bg-[#0e2942] p-4">
      <View className="flex flex-row items-center gap-4">
        <View
          className="rounded-lg p-2"
          style={{
            backgroundColor: iconColor,
          }}
        >
          {!!Icon && <Icon name={iconName} size={20} color="#fff" />}
        </View>
        <Text>
          {log.unitsCompleted} {log.goal?.unit}
        </Text>
      </View>
      <View>
        <Text className="font-semibold">
          {format(new Date(log.date), "h:mm a")}
        </Text>
      </View>
    </View>
  );
}

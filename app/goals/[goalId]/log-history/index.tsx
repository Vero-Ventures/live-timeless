import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { View, Text, ActivityIndicator, FlatList } from "react-native";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { fontFamily } from "~/lib/font";
import { format, isToday, isYesterday } from "date-fns";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import type { Id } from "~/convex/_generated/dataModel";

interface LogType {
  _id: string;
  date: number;
  unitsCompleted: number;
}

function formatDate(timestamp: number) {
  const date = new Date(timestamp);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMM d, yyyy"); // Example: Sunday, Nov 4, 2024
}

export default function LogHistoryPage() {
  const { goalId } = useLocalSearchParams<{ goalId: string }>();
  const goalLogs = useQuery(api.goalLogs.getGoalLogsbyGoalId, {
    goalId: goalId as Id<"goals">,
  });

  useEffect(() => {
    if (goalLogs) {
      console.log(
        "Fetched goal logs with dates:",
        goalLogs.map((log) => ({
          id: log._id,
          date: new Date(log.date).toUTCString(),
          rawTimestamp: log.date,
        }))
      );
    }
  }, [goalLogs]);

  if (!goalLogs) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#082139",
        }}
      >
        <Text
          style={{
            fontFamily: fontFamily.openSans.medium,
            color: "#ffffff",
            fontSize: 16,
          }}
        >
          Loading log history...
        </Text>
        <ActivityIndicator size="large" color="#ffffff" />
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
    <View style={{ flex: 1, backgroundColor: "#082139", padding: 16 }}>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff",
          headerTitle: () => (
            <Text
              style={{
                fontFamily: fontFamily.openSans.bold,
                color: "#ffffff",
                fontSize: 18,
              }}
            >
              Log History
            </Text>
          ),
          headerBackTitleVisible: false,
        }}
      />
      <FlatList
        data={Object.keys(logsByDate)}
        keyExtractor={(date) => date}
        renderItem={({ item: date }) => (
          <View>
            {/* Date Header */}
            <Text
              style={{
                fontFamily: fontFamily.openSans.bold,
                color: "#ffffff",
                fontSize: 16,
                marginTop: 20,
                marginBottom: 10,
              }}
            >
              {date}
            </Text>
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
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0e2942",
        padding: 12,
        borderRadius: 8,
        marginBottom: 8,
      }}
    >
      <View
        style={{
          backgroundColor: "#299240",
          borderRadius: 8,
          padding: 8,
          marginRight: 10,
        }}
      >
        <FontAwesome5 name="clock" size={16} color="#fff" />
      </View>
      <View>
        <Text
          style={{
            fontFamily: fontFamily.openSans.medium,
            color: "#ffffff",
            fontSize: 14,
          }}
        >
          {format(new Date(log.date), "h:mm a")}
        </Text>
        <Text
          style={{
            fontFamily: fontFamily.openSans.medium,
            color: "#ffffff",
            fontSize: 14,
          }}
        >
          {log.unitsCompleted} mins
        </Text>
      </View>
    </View>
  );
}

import { Stack, useLocalSearchParams } from "expo-router";
import { View, ActivityIndicator, FlatList } from "react-native";
import { useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { format, isToday, isYesterday } from "date-fns";
import type { Id } from "~/convex/_generated/dataModel";
import { Text } from "~/components/ui/text";

function formatDate(year: number, month: number, day: number) {
  const date = new Date(year, month, day);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "MMM d, yyyy");
}

export default function LogHistoryPage() {
  const { habitId } = useLocalSearchParams<{ habitId: Id<"habits"> }>();
  const habit = useQuery(api.habits.getHabitByIdWithLogs, {
    habitId,
  });
  console.log(habit?.logs);

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
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      {habit && habit.logs ? (
        <FlatList
          data={habit.logs}
          renderItem={({ item }) => (
            <View className="mb-4">
              {/* Date Header */}
              <Text className="mb-2 pl-4 font-bold">
                {formatDate(item.year, item.month, item.day)}
              </Text>
              <View className="mb-2 flex flex-row items-center justify-between bg-[#0e2942] p-4">
                <View className="flex flex-row items-center gap-4">
                  <Text>
                    {item.unitsCompleted} {habit.unit}
                  </Text>
                </View>
                <View>
                  <Text className="font-semibold">
                    {format(new Date(item._creationTime), "h:mm a")}
                  </Text>
                </View>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <Text className="mt-6 text-center font-medium">
              No log history available.
            </Text>
          )}
        />
      ) : (
        <View className="mt-10 flex flex-row justify-center gap-2">
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
}

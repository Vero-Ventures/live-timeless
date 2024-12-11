import { useQuery } from "convex/react";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { Pressable, View, Share } from "react-native";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";

export default function HabitCompletionScreen() {
  const { habitId } = useLocalSearchParams<{
    habitId: Id<"habits">;
  }>();

  const habitLogs = useQuery(api.habitLogs.getHabitLogsbyHabitId, {
    habitId,
  });

  if (!habitLogs) {
    return <Text>Loading...</Text>;
  }

  const totalLogs = habitLogs.length;
  const completedLogs = habitLogs.filter((log) => log.isComplete).length;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I just completed ${completedLogs} day(s) out of ${totalLogs} towards my habits!`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <View className="h-full items-center justify-center p-4">
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff",
          headerTitle: () => (
            <Text className="text-xl font-bold">Congratulations!</Text>
          ),
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <Text className="text-2xl font-bold text-white">Congratulations!</Text>
      <Text className="mt-4 text-lg text-white">
        You have completed {completedLogs} day(s) out of {totalLogs} towards
        your habit.
      </Text>

      <Pressable
        className="mt-6 w-full items-center rounded-lg bg-blue-600 p-4"
        onPress={handleShare}
      >
        <Text className="text-lg font-bold text-white">
          Share Your Progress
        </Text>
      </Pressable>

      <Pressable
        className="mt-4 w-full items-center rounded-lg bg-green-600 p-4"
        onPress={() => router.navigate("/habits")}
      >
        <Text className="text-lg font-bold text-white">Back to Habits</Text>
      </Pressable>
    </View>
  );
}

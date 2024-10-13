import { View, Pressable, Text, Share } from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { useQuery } from "convex/react";
import { Id } from "~/convex/_generated/dataModel";
import { api } from "~/convex/_generated/api";
import { fontFamily } from "~/lib/font";

export default function GoalCompletionScreen() {
  const { goalId } = useLocalSearchParams<{ goalId: Id<"goals"> }>();

  // Fetch all goalLogs associated with this goalId
  const goalLogs = useQuery(api.goalLogs.getGoalLogsbyGoalId, { goalId });

  if (!goalLogs) {
    return <Text>Loading...</Text>;
  }

  // Calculate total, completed, and remaining goalLogs
  const totalLogs = goalLogs.length;
  const completedLogs = goalLogs.filter((log) => log.isComplete).length;
  const remainingLogs = totalLogs - completedLogs;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I just completed ${completedLogs} day(s) out of ${totalLogs} towards my goal! #goals`,
      });
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <View className="h-full bg-[#0b1a28] p-4 justify-center items-center">
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#0b1a28" },
          headerTintColor: "#fff",
          headerTitle: "Goal Completed",
        }}
      />
      <Text
        className="text-white text-2xl"
        style={{ fontFamily: fontFamily.openSans.bold }}
      >
        Congratulations!
      </Text>
      <Text className="text-white text-lg mt-4">
        You have completed {completedLogs} day(s) out of {totalLogs} towards your goal.
      </Text>

      <Pressable
        className="mt-6 bg-blue-600 p-4 rounded-lg w-full items-center"
        onPress={handleShare}
      >
        <Text
          className="text-white text-lg"
          style={{ fontFamily: fontFamily.openSans.bold }}
        >
          Share Your Progress
        </Text>
      </Pressable>

      <Pressable
        className="mt-4 bg-green-600 p-4 rounded-lg w-full items-center"
        onPress={() => router.navigate("/goals")}
      >
        <Text
          className="text-white text-lg"
          style={{ fontFamily: fontFamily.openSans.bold }}
        >
          Back to Goals
        </Text>
      </Pressable>
    </View>
  );
}


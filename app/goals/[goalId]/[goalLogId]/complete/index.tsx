import { useQuery } from "convex/react";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { Pressable, View, Share, Alert } from "react-native";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import { fontFamily } from "~/lib/font";
import type { Id } from "~/convex/_generated/dataModel";

export default function GoalCompletionScreen() {
  const { goalId } = useLocalSearchParams<{ goalId: Id<"goals"> }>();
  const goal = useQuery(api.goals.getGoalById, { goalId });
  const goalLogs = useQuery(api.goalLogs.getGoalLogsbyGoalId, { goalId });
  if (!goal || !goalLogs) {
    return <Text>Loading...</Text>;
  }

  const totalLogs = goalLogs.length;
  const completedLogs = goalLogs.filter((log) => log.isComplete).length;

  // Sharing Goals
  const handleShare = async () => {
    try {
      await Share.share({
        message: `I just completed ${completedLogs} day(s) out of ${totalLogs} towards my goal
        of ${goal.name}! #goals #wellness`,
      });
      Alert.alert("Success", "Your progress has been shared successfully.");
    } catch (error) {
      console.error("Error sharing:", error);
      Alert.alert("Error", "There was an error sharing your progress. Try again later.");
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
            <Text
              className="text-xl"
              style={{ fontFamily: fontFamily.openSans.bold }}
            >
              Congratulations!
            </Text>
          ),
          headerBackTitleVisible: false,
        }}
      />
      <Text
        className="text-2xl text-white"
        style={{ fontFamily: fontFamily.openSans.bold }}
      >
        Congratulations!
      </Text>
      <Text className="mt-4 text-lg text-white">
        You have completed {completedLogs} day(s) out of {totalLogs} towards
        your goal.
      </Text>

      <Pressable
        className="mt-6 w-full items-center rounded-lg bg-blue-600 p-4"
        onPress={handleShare}
      >
        <Text
          className="text-lg text-white"
          style={{ fontFamily: fontFamily.openSans.bold }}
        >
          Share Your Progress
        </Text>
      </Pressable>

      <Pressable
        className="mt-4 w-full items-center rounded-lg bg-green-600 p-4"
        onPress={() => router.navigate("/goals")}
      >
        <Text
          className="text-lg text-white"
          style={{ fontFamily: fontFamily.openSans.bold }}
        >
          Back to Goals
        </Text>
      </Pressable>
    </View>
  );
}

import { View, Pressable, Alert } from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { Text } from "~/components/ui/text"; // Custom Text component
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api"; // Your API to fetch the goal
import { fontFamily } from "~/lib/font"; // Font library
import type { Id } from "~/convex/_generated/dataModel";
import { useState, useEffect } from "react";

export default function StartGoalScreen() {
  const { goalId, goalLogId } = useLocalSearchParams<{
    goalId: Id<"goals">;
    goalLogId: Id<"goalLogs">;
  }>();

  const goalLog = useQuery(api.goalLogs.getGoalLogById, { goalLogId });
  const updateGoalLog = useMutation(api.goalLogs.updateGoalLog);
  const goal = useQuery(api.goals.getGoalById, { goalId });

  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (goalLog && goal) {
      const unitValue = goal?.unitValue ?? 0;
      const completedUnits = goalLog?.unitsCompleted ?? 0;
      setRemaining(unitValue - completedUnits);
    }
  }, [goalLog, goal]);

  const handleCompleted = async () => {
    setRemaining((prevRemaining) => {
      const newRemaining = prevRemaining - 1;

      if (goalLog) {
        const newUnitsCompleted = (goalLog.unitsCompleted ?? 0) + 1;

        updateGoalLog({
          goalLogId: goalLog._id,
          unitsCompleted: newUnitsCompleted,
        }).catch((error) => {
          console.error("Error updating completed units:", error);
        });

        if (newRemaining === 0) {
          updateGoalLog({
            goalLogId: goalLog._id,
            isComplete: true, // Mark goalLog as completed
          }).catch((error) => {
            console.error("Error updating goalLog as completed:", error);
          });
          Alert.alert(
            "Goal Completed",
            `Congratulations! You've completed the goal.`,
            [
              {
                text: "OK",
                onPress: () =>
                  router.push({
                    pathname: "/goals/[goalId]/[goalLogId]/complete",
                    params: { goalId, goalLogId },
                  }),
                // Navigate back to goals
              },
            ]
          );
        }

        return newRemaining;
      }

      return prevRemaining; // Fallback in case goalLog is undefined
    });
  };

  if (!goal || !goalLog) {
    return <Text>Loading...</Text>;
  }

  return (
    <View className="h-full items-center justify-center bg-[#0b1a28] p-4">
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff", // Ensures white color for the header
          headerTitle: () => (
            <Text
              className="text-xl"
              style={{ fontFamily: fontFamily.openSans.bold }}
            >
              {goal.name} in Progress
            </Text>
          ),
          headerBackTitleVisible: false,
        }}
      />

      {/* Grouping all the text elements */}
      <View className="items-center justify-center">
        {/* Counter for Unit Value */}
        <Text
          className="text-center text-6xl text-white" // Centering the remaining number
          style={{ fontFamily: fontFamily.openSans.bold }}
        >
          {remaining} {/* Show remaining count */}
        </Text>

        {/* "Left" Text */}
        <Text className="mt-2 text-center text-xl text-gray-400">left</Text>
      </View>

      {/* Button for "Completed" */}
      <Pressable
        className="mt-6 w-full items-center rounded-lg bg-green-600 p-4"
        onPress={handleCompleted} // Decrement the total when completed
      >
        <Text
          className="text-lg text-white"
          style={{ fontFamily: fontFamily.openSans.bold }}
        >
          Completed
        </Text>
      </Pressable>

      {/* Button for "Quit" */}
      <Pressable
        className="mt-4 w-full items-center rounded-lg bg-red-600 p-4"
        onPress={() => console.log("Quit clicked")}
      >
        <Text
          className="text-lg text-white"
          style={{ fontFamily: fontFamily.openSans.bold }}
        >
          Quit
        </Text>
      </Pressable>
    </View>
  );
}

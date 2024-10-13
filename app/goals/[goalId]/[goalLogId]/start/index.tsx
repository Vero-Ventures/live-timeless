import { View, Pressable, Alert } from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Text } from '~/components/ui/text';  // Custom Text component
import { useQuery, useMutation } from 'convex/react';
import { api } from '~/convex/_generated/api';  // Your API to fetch the goal
import { fontFamily } from '~/lib/font';  // Font library
import { Id } from "~/convex/_generated/dataModel";
import { useState, useEffect } from 'react';

export default function StartGoalScreen() {
  const { goalId, goalLogId } = useLocalSearchParams<{ goalId: Id<"goals">, goalLogId: Id<"goalLogs"> }>();

  // Fetch goalLog related to the goalId
  const goalLog = useQuery(api.goalLogs.getGoalLogById, { goalLogId });
  const updateGoalLog = useMutation(api.goalLogs.updateGoalLog);  // Mutation to update goalLog
  const goal = useQuery(api.goals.getGoalById, { goalId }); // Fetch the goal for goal details

  const [remaining, setRemaining] = useState(0);  // Start at 0 initially

  // Recalculate the remaining value when the goalLog is fetched from the backend
  useEffect(() => {
    if (goalLog && goal) {
      const unitValue = goal?.unitValue ?? 0;
      const completedUnits = goalLog?.unitsCompleted ?? 0;
      setRemaining(unitValue - completedUnits);  // Calculate remaining units
    }
  }, [goalLog, goal]);

  // Optimistically update the UI and send update to backend
  const handleCompleted = async () => {
    // Optimistically update the UI by decreasing remaining by 1
    setRemaining((prevRemaining) => {
      const newRemaining = prevRemaining - 1;

      // Update the backend in the background
      if (goalLog) {
        const newUnitsCompleted = (goalLog.unitsCompleted ?? 0) + 1;

        // Optimistically update the backend
        updateGoalLog({
          goalLogId: goalLog._id,
          unitsCompleted: newUnitsCompleted,  // Send updated completedUnits to backend
        }).catch(error => {
          console.error("Error updating completed units:", error);
        });

        // If all reps are done, show an alert
        if (newRemaining === 0) {
          updateGoalLog({
            goalLogId: goalLog._id,
            isComplete: true,  // Mark goalLog as completed
          }).catch(error => {
            console.error("Error updating goalLog as completed:", error);
          });
          Alert.alert(
            "Goal Completed",
            `Congratulations! You've completed the goal.`,
            [
              {
                text: "OK",
                onPress: () => router.push({
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

      return prevRemaining;  // Fallback in case goalLog is undefined
    });
  };

  if (!goal || !goalLog) {
    return <Text>Loading...</Text>;
  }

  return (
    <View className="h-full bg-[#0b1a28] p-4 justify-center items-center">
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff",  // Ensures white color for the header
          headerTitle: () => (
            <Text className="text-xl" style={{ fontFamily: fontFamily.openSans.bold }}>
              {goal.name} in Progress
            </Text>
          ),
          headerBackTitleVisible: false,
        }}
      />

      {/* Grouping all the text elements */}
      <View className="justify-center items-center">
        {/* Counter for Unit Value */}
        <Text
          className="text-white text-6xl text-center"  // Centering the remaining number
          style={{ fontFamily: fontFamily.openSans.bold }}
        >
          {remaining}  {/* Show remaining count */}
        </Text>

        {/* "Left" Text */}
        <Text className="text-gray-400 text-xl text-center mt-2">
          left
        </Text>
      </View>

      {/* Button for "Completed" */}
      <Pressable
        className="mt-6 bg-green-600 p-4 rounded-lg w-full items-center"
        onPress={handleCompleted}  // Decrement the total when completed
      >
        <Text className="text-white text-lg" style={{ fontFamily: fontFamily.openSans.bold }}>
          Completed
        </Text>
      </Pressable>

      {/* Button for "Quit" */}
      <Pressable
        className="mt-4 bg-red-600 p-4 rounded-lg w-full items-center"
        onPress={() => console.log("Quit clicked")}
      >
        <Text className="text-white text-lg" style={{ fontFamily: fontFamily.openSans.bold }}>
          Quit
        </Text>
      </Pressable>
    </View>
  );
}

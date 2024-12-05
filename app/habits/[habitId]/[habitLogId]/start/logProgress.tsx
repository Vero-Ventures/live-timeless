import {
  View,
  Pressable,
  Alert,
  TextInput,
  ScrollView,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { Text } from "~/components/ui/text"; // Custom Text component
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api"; // Your API to fetch the goal
import { fontFamily } from "~/lib/font"; // Font library
import { useState, useEffect } from "react";
import type { Id } from "~/convex/_generated/dataModel";

export default function LogProgressScreen() {
  const { goalId, goalLogId } = useLocalSearchParams<{
    goalId: Id<"goals">;
    goalLogId: Id<"goalLogs">;
  }>();

  const goalLog = useQuery(api.goalLogs.getGoalLogById, { goalLogId });
  const updateGoalLog = useMutation(api.goalLogs.updateGoalLog);
  const goal = useQuery(api.goals.getGoalById, { goalId });

  const [remaining, setRemaining] = useState(0); // Remaining units for the goal
  const [progressInput, setProgressInput] = useState(""); // Track input for the progress value
  const [completed, setCompleted] = useState(0); // Track completed units

  useEffect(() => {
    if (goalLog && goal) {
      const unitValue = goal?.unitValue ?? 0;
      const completedUnits = goalLog?.unitsCompleted ?? 0;
      setCompleted(completedUnits); // Set the completed units so far
      setRemaining(unitValue - completedUnits); // Calculate remaining units
    }
  }, [goalLog, goal]);

  const handleLogProgress = async () => {
    const inputProgress = parseFloat(progressInput); // Convert input to number

    if (isNaN(inputProgress) || inputProgress <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid positive number.");
      return;
    }

    if (inputProgress > remaining) {
      Alert.alert(
        "Input Too Large",
        "The amount entered exceeds the remaining goal value."
      );
      return;
    }

    setRemaining((prevRemaining) => {
      const newRemaining = prevRemaining - inputProgress;

      if (goalLog) {
        const newUnitsCompleted = (goalLog.unitsCompleted ?? 0) + inputProgress;
        setCompleted(newUnitsCompleted); // Update completed units in state

        updateGoalLog({
          goalLogId: goalLog._id,
          unitsCompleted: newUnitsCompleted,
        }).catch((error) => {
          console.error("Error updating completed units:", error);
        });

        if (newRemaining <= 0) {
          const completionDate = new Date();
          console.log(
            "Marking goal as complete at:",
            completionDate.toISOString()
          );

          updateGoalLog({
            goalLogId: goalLog._id,
            isComplete: true,
            targetDate: completionDate.getTime(), // Pass targetDate when marking complete
          }).catch((error) => {
            console.error("Error updating goalLog as complete:", error);
          });
          Alert.alert(
            "Goal Completed",
            `Congratulations! You've completed the goal.`,
            [{ text: "OK", onPress: () => router.back() }] // Go back to the previous page
          );
        } else {
          router.back(); // Navigate back after logging progress
        }

        return newRemaining;
      }

      return prevRemaining; // Fallback if goalLog is undefined
    });
  };

  if (!goal || !goalLog) {
    return <Text>Loading...</Text>;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="h-full items-center justify-center bg-[#0b1a28] p-4">
          <Stack.Screen
            options={{
              headerStyle: { backgroundColor: "#0b1a28" },
              headerTintColor: "#fff",
              headerTitle: () => (
                <Text
                  className="text-xl"
                  style={{ fontFamily: fontFamily.openSans.bold }}
                >
                  Log Progress for {goal.name}
                </Text>
              ),
              headerBackTitleVisible: false,
            }}
          />

          {/* Completed / Total Units Display */}
          <View className="items-center justify-center">
            <Text
              className="text-center text-6xl text-white"
              style={{ fontFamily: fontFamily.openSans.bold }}
            >
              {completed} / {goal.unitValue} {goal.unit}
            </Text>
          </View>

          {/* Input Field for Progress */}
          <TextInput
            className="mt-6 w-full rounded-lg bg-white p-4 text-lg"
            value={progressInput}
            onChangeText={setProgressInput} // Update state when typing
            keyboardType="numeric" // Numeric keyboard for input
            placeholder="Enter value to log"
          />

          {/* Log Progress Button */}
          <Pressable
            className="mt-4 w-full items-center rounded-lg bg-green-600 p-4"
            onPress={handleLogProgress}
          >
            <Text
              className="text-lg text-white"
              style={{ fontFamily: fontFamily.openSans.bold }}
            >
              Log Progress
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

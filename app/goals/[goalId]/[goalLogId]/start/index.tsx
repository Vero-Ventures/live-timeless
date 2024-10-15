import {
  View,
  Pressable,
  Alert,
  TextInput,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { Text } from "~/components/ui/text"; // Custom Text component
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api"; // Your API to fetch the goal
import { fontFamily } from "~/lib/font"; // Font library
import type { Id } from "~/convex/_generated/dataModel";
import { useState, useEffect } from "react";

export default function LogProgressScreen() {
  const { goalId, goalLogId } = useLocalSearchParams<{
    goalId: Id<"goals">;
    goalLogId: Id<"goalLogs">;
  }>();

  const goalLog = useQuery(api.goalLogs.getGoalLogById, { goalLogId });
  const updateGoalLog = useMutation(api.goalLogs.updateGoalLog);
  const goal = useQuery(api.goals.getGoalById, { goalId });

  const [remaining, setRemaining] = useState(0);
  const [progressInput, setProgressInput] = useState(""); // Track input for the progress value
  const [completed, setCompleted] = useState(0); // Track completed units

  useEffect(() => {
    if (goalLog && goal) {
      const unitValue = goal?.unitValue ?? 0;
      const completedUnits = goalLog?.unitsCompleted ?? 0;
      setCompleted(completedUnits); // Set the total units completed so far
      setRemaining(unitValue - completedUnits); // Calculate the remaining units
    }
  }, [goalLog, goal]);

  const handleLogProgress = async () => {
    const inputProgress = parseFloat(progressInput); // Convert the input to a number

    if (isNaN(inputProgress) || inputProgress <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid positive number.");
      return;
    }

    // Check if inputProgress is greater than the remaining units
    if (inputProgress > remaining) {
      Alert.alert(
        "Input Too Large",
        "The amount entered exceeds the remaining goal value."
      );
      return;
    }

    setRemaining((prevRemaining) => {
      const newRemaining = prevRemaining - inputProgress; // Decrease the remaining units based on input

      if (goalLog) {
        const newUnitsCompleted = (goalLog.unitsCompleted ?? 0) + inputProgress;
        setCompleted(newUnitsCompleted); // Update the completed units in the state

        updateGoalLog({
          goalLogId: goalLog._id,
          unitsCompleted: newUnitsCompleted,
        }).catch((error) => {
          console.error("Error updating completed units:", error);
        });

        if (newRemaining <= 0) {
          updateGoalLog({
            goalLogId: goalLog._id,
            isComplete: true, // Mark goalLog as completed if it's finished
          }).catch((error) => {
            console.error("Error updating goalLog as completed:", error);
          });
          Alert.alert(
            "Goal Completed",
            `Congratulations! You've completed the goal.`,
            [{ text: "OK", onPress: () => router.back() }] // Navigate back to the previous page after completion
          );
        } else {
          // Navigate back after logging progress
          router.back();
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
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
                  Log Progress for {goal.name}
                </Text>
              ),
              headerBackTitleVisible: false,
            }}
          />

          <View className="items-center justify-center">
            {/* Display Completed / Total Units with Unit */}
            <Text
              className="text-center text-6xl text-white"
              style={{ fontFamily: fontFamily.openSans.bold }}
            >
              {completed} / {goal?.unitValue} {goal?.unit}
            </Text>
          </View>

          {/* Input Field for Progress */}
          <TextInput
            className="mt-6 w-full rounded-lg bg-white p-4 text-lg"
            value={progressInput}
            onChangeText={setProgressInput} // Update state when the user types
            keyboardType="numeric"
            placeholder="Enter value to log"
          />

          {/* Button to Log Progress */}
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

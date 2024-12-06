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
import { Text } from "~/components/ui/text";
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import { fontFamily } from "~/lib/font";
import { useState, useEffect } from "react";
import type { Id } from "~/convex/_generated/dataModel";

export default function LogProgressScreen() {
  const { habitId, habitLogId } = useLocalSearchParams<{
    habitId: Id<"habits">;
    habitLogId: Id<"habitLogs">;
  }>();

  const habitLog = useQuery(api.habitLogs.getHabitLogById, {
    habitLogId,
  });
  const updateHabitLog = useMutation(api.habitLogs.updateHabitLog);
  const habit = useQuery(api.habits.getHabitById, { habitId });

  const [remaining, setRemaining] = useState(0); // Remaining units for the habit
  const [progressInput, setProgressInput] = useState(""); // Track input for the progress value
  const [completed, setCompleted] = useState(0); // Track completed units

  useEffect(() => {
    if (habitLog && habit) {
      const unitValue = habit?.unitValue ?? 0;
      const completedUnits = habitLog?.unitsCompleted ?? 0;
      setCompleted(completedUnits); // Set the completed units so far
      setRemaining(unitValue - completedUnits); // Calculate remaining units
    }
  }, [habitLog, habit]);

  const handleLogProgress = async () => {
    const inputProgress = parseFloat(progressInput); // Convert input to number

    if (isNaN(inputProgress) || inputProgress <= 0) {
      Alert.alert("Invalid Input", "Please enter a valid positive number.");
      return;
    }

    if (inputProgress > remaining) {
      Alert.alert(
        "Input Too Large",
        "The amount entered exceeds the remaining habit value."
      );
      return;
    }

    setRemaining((prevRemaining) => {
      const newRemaining = prevRemaining - inputProgress;

      if (habitLog) {
        const newUnitsCompleted =
          (habitLog.unitsCompleted ?? 0) + inputProgress;
        setCompleted(newUnitsCompleted); // Update completed units in state

        updateHabitLog({
          habitLogId: habitLog._id,
          unitsCompleted: newUnitsCompleted,
        }).catch((error) => {
          console.error("Error updating completed units:", error);
        });

        if (newRemaining <= 0) {
          const completionDate = new Date();
          console.log(
            "Marking habit as complete at:",
            completionDate.toISOString()
          );

          updateHabitLog({
            habitLogId: habitLog._id,
            isComplete: true,
            targetDate: completionDate.getTime(), // Pass targetDate when marking complete
          }).catch((error) => {
            console.error("Error updating habitLog as complete:", error);
          });
          Alert.alert(
            "Habit Completed",
            `Congratulations! You've completed the habit.`,
            [{ text: "OK", onPress: () => router.back() }] // Go back to the previous page
          );
        } else {
          router.back(); // Navigate back after logging progress
        }

        return newRemaining;
      }

      return prevRemaining; // Fallback if habitLog is undefined
    });
  };

  if (!habit || !habitLog) {
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
                  Log Progress for {habit.name}
                </Text>
              ),
              headerBackButtonDisplayMode: "minimal",
            }}
          />

          {/* Completed / Total Units Display */}
          <View className="items-center justify-center">
            <Text
              className="text-center text-6xl text-white"
              style={{ fontFamily: fontFamily.openSans.bold }}
            >
              {completed} / {habit.unitValue} {habit.unit}
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

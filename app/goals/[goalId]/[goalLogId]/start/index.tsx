import { View, Pressable, Alert } from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { Text } from "~/components/ui/text"; // Custom Text component
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api"; // Your API to fetch the goal
import { fontFamily } from "~/lib/font"; // Font library
import type { Id } from "~/convex/_generated/dataModel";
import { useState, useEffect } from "react";
import { useTimer } from "./useTimer";

export default function StartGoalScreen() {
  const { goalId, goalLogId } = useLocalSearchParams<{
    goalId: Id<"goals">;
    goalLogId: Id<"goalLogs">;
  }>();

  const goalLog = useQuery(api.goalLogs.getGoalLogById, { goalLogId });
  const updateGoalLog = useMutation(api.goalLogs.updateGoalLog);
  const goal = useQuery(api.goals.getGoalById, { goalId });
  const updateGoalLog = useMutation(api.goalLogs.updateGoalLog);
  const goal = useQuery(api.goals.getGoalById, { goalId });

  const { timeLeft, startTimer, pauseTimer, resetTimer, isRunning } =
    useTimer(0); // Updated to include isRunning state
  const [isDurationGoal, setIsDurationGoal] = useState(false); // Flag for duration-based goals
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null); // Track timeLeft when starting
  const [remaining, setRemaining] = useState(0); // For unit-based goals

  useEffect(() => {
    if (goalLog && goal) {
      const unitValue = goal?.unitValue ?? 0; // Full duration value
      const completedUnits = goalLog?.unitsCompleted ?? 0; // Elapsed time from DB

      // Check if the goal is duration-based
      if (goal?.unitType === "Duration") {
        setIsDurationGoal(true); // Mark this goal as a duration-based goal

        // Calculate the initial time in seconds based on unitsCompleted
        const initialTimeInSeconds =
          goal.unit === "min"
            ? Math.floor((unitValue - completedUnits) * 60) // For minutes
            : Math.floor((unitValue - completedUnits) * 3600); // For hours

        resetTimer(initialTimeInSeconds); // Set the timer to the correct time
      } else {
        setRemaining(unitValue - completedUnits); // For unit-based goals, calculate remaining units
      }
    }
    // No resetTimer in the dependency array
  }, [goalLog, goal]);

  useEffect(() => {
    if (timeLeft === 0 && isDurationGoal) {
      handleCompleted(); // Automatically complete the goal when time reaches 0
    }
  }, [timeLeft]);

  // Handle toggling between start and pause
  const handleToggleTimer = async () => {
    if (isRunning) {
      // Pause the timer
      await handlePause();
    } else {
      // Start the timer and track the session start time
      setSessionStartTime(timeLeft); // Capture the timeLeft when the session starts
      startTimer();
    }
  };

  // Pause the timer and sync with the backend
  const handlePause = async () => {
    if (!goal || !goalLog || sessionStartTime === null) return;

    // Pause the timer locally first to prevent UI blocking
    pauseTimer();

    // Calculate how much time passed in this session
    const elapsedSeconds = sessionStartTime - timeLeft; // How much time has passed in this session
    const elapsedUnits =
      goal.unit === "min" ? elapsedSeconds / 60 : elapsedSeconds / 3600; // Convert to minutes or hours

    console.log(
      `Elapsed time: ${elapsedUnits} units (${elapsedSeconds} seconds)`
    );

    // Update the backend asynchronously after pausing the timer
    try {
      await updateGoalLog({
        goalLogId: goalLog._id,
        unitsCompleted: (goalLog.unitsCompleted ?? 0) + elapsedUnits,
      });
      console.log("Pause: Database updated successfully");
    } catch (error) {
      console.error("Error updating unitsCompleted:", error);
    }

    // Reset session start time to null since the timer is paused
    setSessionStartTime(null);
  };

  const handleCompleted = async () => {
    if (isDurationGoal) {
      if (timeLeft === 0 && goal && goalLog) {
        // Simply send the goal's full unit value as units completed
        const maxUnitsCompleted = goal?.unitValue ?? 0; // Fallback to 0 if unitValue is undefined

        try {
          await updateGoalLog({
            goalLogId: goalLog._id,
            unitsCompleted: maxUnitsCompleted, // Send full unit value to the DB
            isComplete: true, // Mark goalLog as completed
          });
          console.log(`Goal completed with ${maxUnitsCompleted} units`);

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
              },
            ]
          );
        } catch (error) {
          console.error("Error completing the goal:", error);
        }
      }
    } else if (goalLog) {
      // Handle unit-based goals (no changes here)
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
                },
              ]
            );
          }

          return newRemaining;
        }

        return prevRemaining; // Fallback in case goalLog is undefined
      });
    }
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
              {goal?.name} in Progress
            </Text>
          ),
          headerBackTitleVisible: false,
        }}
      />

      {/* Only show units left if it's NOT a duration-based goal */}
      {!isDurationGoal && (
        <View className="items-center justify-center">
          {/* Counter for Unit Value */}
          <Text
            className="text-center text-6xl text-white"
            style={{ fontFamily: fontFamily.openSans.bold }}
          >
            {remaining} {/* Show remaining count */}
          </Text>

          {/* "Left" Text */}
          <Text className="mt-2 text-center text-xl text-gray-400">left</Text>
        </View>
      )}

      {/* Show Timer for Duration-based Goals */}
      {isDurationGoal && (
        <View className="items-center justify-center">
          {/* Timer Display */}
          <Text
            className="text-center text-6xl text-white"
            style={{
              fontFamily: fontFamily.openSans.bold,
              marginTop: 10, // Add some margin to avoid clipping
              lineHeight: 70, // Ensure enough line height for large text
            }}
          >
            {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}{" "}
            {/* Show time in MM:SS format */}
          </Text>

          {/* Timer Controls */}
          <View className="mt-4 flex-row items-center justify-center">
            <Pressable
              className={`w-full items-center rounded-lg p-4 ${
                isRunning
                  ? "bg-yellow-600"
                  : (goalLog?.unitsCompleted ?? 0) > 0
                    ? "bg-green-600"
                    : "bg-green-600"
              }`}
              onPress={handleToggleTimer}
              style={{ maxWidth: 600 }} // Static max width for consistent sizing
            >
              <Text
                className="text-lg text-white"
                style={{ fontFamily: fontFamily.openSans.bold }}
              >
                {isRunning
                  ? "Pause"
                  : (goalLog?.unitsCompleted ?? 0) > 0
                    ? "Resume"
                    : "Start"}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Button for "Completed" */}
      {!isDurationGoal && (
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
      )}

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

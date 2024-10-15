import {
  View,
  Pressable,
  Alert,
} from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { Text } from "~/components/ui/text"; // Custom Text component
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api"; // Your API to fetch the goal
import { fontFamily } from "~/lib/font"; // Font library
import type { Id } from "~/convex/_generated/dataModel";
import { useState, useCallback, useEffect } from "react";
import { useTimer } from "./useTimer";

export default function LogProgressScreen() {
  const { goalId, goalLogId } = useLocalSearchParams<{
    goalId: Id<"goals">;
    goalLogId: Id<"goalLogs">;
  }>();

  const goalLog = useQuery(api.goalLogs.getGoalLogById, { goalLogId });
  const updateGoalLog = useMutation(api.goalLogs.updateGoalLog);
  const goal = useQuery(api.goals.getGoalById, { goalId });

  const { timeLeft, startTimer, pauseTimer, setTimer, isRunning } = useTimer(0);
  const [isDurationGoal, setIsDurationGoal] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);

  const timerButtonColor = isRunning ? "bg-yellow-600" : "bg-green-600";

  const handlePause = useCallback(async () => {
    if (!goal || !goalLog || sessionStartTime === null) return;

    pauseTimer();

    const elapsedSeconds = sessionStartTime - timeLeft;
    const elapsedUnits =
      goal.unit === "minutes" || goal.unit === "min"
        ? elapsedSeconds / 60 // Convert seconds to minutes
        : elapsedSeconds / 3600; // Convert seconds to hours if unit is hours

    try {
      await updateGoalLog({
        goalLogId: goalLog._id,
        unitsCompleted: (goalLog.unitsCompleted ?? 0) + elapsedUnits,
      });
    } catch (error) {
      console.error("Error updating unitsCompleted:", error);
    }

    setSessionStartTime(null);
  }, [goal, goalLog, sessionStartTime, timeLeft, pauseTimer, updateGoalLog]);

  const handleToggleTimer = useCallback(async () => {
    if (isRunning) {
      await handlePause();
    } else {
      if (sessionStartTime === null) {
        setSessionStartTime(timeLeft); // Capture the timeLeft when the session starts
      }
      startTimer();
    }
  }, [isRunning, handlePause, sessionStartTime, timeLeft, startTimer]);

  const handleCompleted = useCallback(async () => {
    if (isDurationGoal && timeLeft === 0 && goal && goalLog) {
      const maxUnitsCompleted = goal.unitValue ?? 0;

      try {
        await updateGoalLog({
          goalLogId: goalLog._id,
          unitsCompleted: maxUnitsCompleted,
          isComplete: true,
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
      } catch (error) {
        console.error("Error completing the goal:", error);
      }
    } else {
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
              isComplete: true,
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

        return prevRemaining;
      });
    }
  }, [
    isDurationGoal,
    timeLeft,
    goal,
    goalLog,
    updateGoalLog,
    goalId,
    goalLogId,
  ]);

  useEffect(() => {
    if (goalLog && goal) {
      const unitValue = goal.unitValue ?? 0;
      const completedUnits = goalLog.unitsCompleted ?? 0;

      if (goal.unitType === "Duration" || goal.unit === "minutes") {
        setIsDurationGoal(true);
        const initialTimeInSeconds =
          goal.unit === "min" || goal.unit === "minutes"
            ? Math.floor((unitValue - completedUnits) * 60)
            : Math.floor((unitValue - completedUnits) * 3600);
        setTimer(initialTimeInSeconds);
      } else {
        setIsDurationGoal(false);
        setRemaining(
          unitValue - completedUnits >= 0 ? unitValue - completedUnits : 0
        );
      }
    }
  }, [goalLog, goal, setTimer]);

  useEffect(() => {
    if (timeLeft === 0 && isDurationGoal && !goalLog?.isComplete) {
      handleCompleted();
    }
  }, [timeLeft, isDurationGoal, goalLog?.isComplete, handleCompleted]);

  if (!goal || !goalLog) {
    return <Text>Loading...</Text>;
  }

  return (
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
              {goal?.name ?? ""}
            </Text>
          ),
          headerBackTitleVisible: false,
        }}
      />

      {/* Units Left for non-duration goals */}
      {!isDurationGoal && (
        <View className="items-center justify-center">
          <Text
            className="text-center text-6xl text-white"
            style={{ fontFamily: fontFamily.openSans.bold }}
          >
            {remaining}
          </Text>
          <Text className="mt-2 text-center text-xl text-gray-400">left</Text>
        </View>
      )}

      {/* Timer for duration goals */}
      {!!isDurationGoal && (
        <View className="items-center justify-center">
          <Text
            className="text-center text-6xl text-white"
            style={{ fontFamily: fontFamily.openSans.bold }}
          >
            {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </Text>
          <View className="mt-4 flex-row items-center justify-center">
            <Pressable
              className={`w-full items-center rounded-lg p-4 ${timerButtonColor}`}
              onPress={handleToggleTimer}
              style={{ maxWidth: 600 }}
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

      {/* Completed Button for non-duration goals */}
      {!isDurationGoal && (
        <Pressable
          className="mt-6 w-full items-center rounded-lg bg-green-600 p-4"
          onPress={handleCompleted}
        >
          <Text
            className="text-lg text-white"
            style={{ fontFamily: fontFamily.openSans.bold }}
          >
            Completed
          </Text>
        </Pressable>
      )}

      {/* Quit Button */}
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

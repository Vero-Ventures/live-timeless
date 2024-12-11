import { View, Pressable, Alert } from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { Text } from "~/components/ui/text";
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";
import { useState, useCallback, useEffect } from "react";
import { useTimer } from "~/hooks/useTimer";

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

  const { timeLeft, startTimer, pauseTimer, setTimer, isRunning } = useTimer(0);
  const [isDurationHabit, setIsDurationHabit] = useState(false);
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);

  const timerButtonColor = isRunning ? "bg-yellow-600" : "bg-green-600";

  const handlePause = useCallback(async () => {
    if (!habit || !habitLog || sessionStartTime === null) return;

    pauseTimer();

    const elapsedSeconds = sessionStartTime - timeLeft;
    const elapsedUnits =
      habit.unit === "minutes" || habit.unit === "min"
        ? elapsedSeconds / 60 // Convert seconds to minutes
        : elapsedSeconds / 3600; // Convert seconds to hours if unit is hours

    try {
      await updateHabitLog({
        habitLogId: habitLog._id,
        unitsCompleted: (habitLog.unitsCompleted ?? 0) + elapsedUnits,
      });
    } catch (error) {
      console.error("Error updating unitsCompleted:", error);
    }

    setSessionStartTime(null);
  }, [habit, habitLog, sessionStartTime, timeLeft, pauseTimer, updateHabitLog]);

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
    if (isDurationHabit && timeLeft === 0 && habit && habitLog) {
      const maxUnitsCompleted = habit.unitValue ?? 0;

      try {
        await updateHabitLog({
          habitLogId: habitLog._id,
          unitsCompleted: maxUnitsCompleted,
          isComplete: true,
        });

        Alert.alert(
          "Habit Completed",
          `Congratulations! You've completed the habit.`,
          [
            {
              text: "OK",
              onPress: () =>
                router.push({
                  pathname: "/habits/[habitId]/[habitLogId]/complete",
                  params: { habitId, habitLogId },
                }),
            },
          ]
        );
      } catch (error) {
        console.error("Error completing the habit:", error);
      }
    } else {
      setRemaining((prevRemaining) => {
        const newRemaining = prevRemaining - 1;

        if (habitLog) {
          const newUnitsCompleted = (habitLog.unitsCompleted ?? 0) + 1;

          updateHabitLog({
            habitLogId: habitLog._id,
            unitsCompleted: newUnitsCompleted,
          }).catch((error) => {
            console.error("Error updating completed units:", error);
          });

          if (newRemaining === 0) {
            updateHabitLog({
              habitLogId: habitLog._id,
              isComplete: true,
            }).catch((error) => {
              console.error("Error updating habit log as completed:", error);
            });

            Alert.alert(
              "Habit Completed",
              `Congratulations! You've completed the habit.`,
              [
                {
                  text: "OK",
                  onPress: () =>
                    router.push({
                      pathname: "/habits/[habitId]/[habitLogId]/complete",
                      params: { habitId, habitLogId },
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
    isDurationHabit,
    timeLeft,
    habit,
    habitLog,
    updateHabitLog,
    habitId,
    habitLogId,
  ]);

  useEffect(() => {
    if (habitLog && habit) {
      const unitValue = habit.unitValue ?? 0;
      const completedUnits = habitLog.unitsCompleted ?? 0;

      if (habit.unitType === "Duration" || habit.unit === "minutes") {
        setIsDurationHabit(true);
        const initialTimeInSeconds =
          habit.unit === "min" || habit.unit === "minutes"
            ? Math.floor((unitValue - completedUnits) * 60)
            : Math.floor((unitValue - completedUnits) * 3600);
        setTimer(initialTimeInSeconds);
      } else {
        setIsDurationHabit(false);
        setRemaining(
          unitValue - completedUnits >= 0 ? unitValue - completedUnits : 0
        );
      }
    }
  }, [habitLog, habit, setTimer]);

  useEffect(() => {
    if (timeLeft === 0 && isDurationHabit && !habitLog?.isComplete) {
      handleCompleted();
    }
  }, [timeLeft, isDurationHabit, habitLog?.isComplete, handleCompleted]);

  if (!habit || !habitLog) {
    return <Text>Loading...</Text>;
  }

  return (
    <View className="h-full items-center justify-center bg-[#0b1a28] p-4">
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#0b1a28" },
          headerTintColor: "#fff",
          headerTitle: () => (
            <Text className="text-xl font-bold">{habit?.name ?? ""}</Text>
          ),
          headerBackButtonDisplayMode: "minimal",
        }}
      />

      {/* Units Left for non-duration habits */}
      {!isDurationHabit && (
        <View className="items-center justify-center">
          <Text className="text-center text-6xl font-bold text-white">
            {remaining}
          </Text>
          <Text className="mt-2 text-center text-xl text-gray-400">left</Text>
        </View>
      )}

      {/* Timer for duration habits */}
      {!!isDurationHabit && (
        <View className="items-center justify-center">
          <Text className="text-center text-6xl font-bold text-white">
            {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </Text>
          <View className="mt-4 flex-row items-center justify-center">
            <Pressable
              className={`w-full items-center rounded-lg p-4 ${timerButtonColor}`}
              onPress={handleToggleTimer}
              style={{ maxWidth: 600 }}
            >
              <Text className="text-lg font-bold text-white">
                {isRunning
                  ? "Pause"
                  : (habitLog?.unitsCompleted ?? 0) > 0
                    ? "Resume"
                    : "Start"}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* Completed Button for non-duration habits */}
      {!isDurationHabit && (
        <Pressable
          className="mt-6 w-full items-center rounded-lg bg-green-600 p-4"
          onPress={handleCompleted}
        >
          <Text className="text-lg font-bold text-white">Completed</Text>
        </Pressable>
      )}

      {/* Quit Button */}
      <Pressable
        className="mt-4 w-full items-center rounded-lg bg-red-600 p-4"
        onPress={() => console.log("Quit clicked")}
      >
        <Text className="text-lg font-bold text-white">Quit</Text>
      </Pressable>
    </View>
  );
}

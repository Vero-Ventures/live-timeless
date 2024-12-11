import { View, ActivityIndicator } from "react-native";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Text } from "~/components/ui/text";
import { useQuery, useMutation } from "convex/react";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";
import { useState } from "react";
import { Input } from "~/components/ui/input";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { AlertCircle } from "lucide-react-native";
import FormSubmitButton from "~/components/form-submit-button";
import { getDate } from "date-fns";

export default function LogProgressScreen() {
  const { habitId, date } = useLocalSearchParams<{
    habitId: Id<"habits">;
    date: string;
  }>();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [unitsCompleted, setUnitsCompleted] = useState("");

  const selectedDate = new Date(date);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const day = getDate(selectedDate);

  const habit = useQuery(api.habits.getHabitByIdWithLogForCurrentDay, {
    habitId,
    year,
    month,
    day,
  });

  const createHabitLog = useMutation(api.habitLogs.createHabitLog);
  const updateHabitLog = useMutation(api.habitLogs.updateHabitLog);

  return (
    <View className="h-full bg-background p-4 pt-10">
      {!!error && (
        <Alert icon={AlertCircle} variant="destructive" className="max-w-xl">
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: "#0b1a28" },
          headerTintColor: "#fff",
          headerTitle: () => (
            <Text className="text-xl font-bold">Log Progress</Text>
          ),
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      {habit ? (
        <View className="gap-4">
          <View className="relative">
            <Input
              className="pr-24"
              value={unitsCompleted}
              onChangeText={setUnitsCompleted}
              keyboardType="numeric"
              placeholder="Enter value"
            />
            <Text className="absolute right-3 top-2 text-center font-bold">
              {habit.unit}
            </Text>
          </View>

          <FormSubmitButton
            size="lg"
            isPending={isPending}
            onPress={async () => {
              setError("");
              setIsPending(true);
              try {
                const unitsCompletedNumber = parseInt(unitsCompleted);
                if (isNaN(unitsCompletedNumber)) {
                  throw new Error("You must enter a valid number");
                }
                if (unitsCompletedNumber === 0) {
                  throw new Error("You must enter a value greater than 0");
                }

                if (!habit.log) {
                  const newLogId = await createHabitLog({
                    habitId: habit._id,
                    year,
                    month,
                    day,
                    unitsCompleted: unitsCompletedNumber,
                    isComplete: unitsCompletedNumber >= habit.unitValue,
                  });

                  if (!newLogId) {
                    throw new Error(
                      "Log couldn't be created. Please try again."
                    );
                  }
                  return;
                }

                const newUnitsCompleted =
                  habit.log.unitsCompleted + unitsCompletedNumber;

                if (
                  newUnitsCompleted >= habit.unitValue &&
                  !habit.log.isComplete
                ) {
                  await updateHabitLog({
                    habitLogId: habit.log._id,
                    unitsCompleted: newUnitsCompleted,
                    isComplete: true,
                  });
                } else {
                  await updateHabitLog({
                    habitLogId: habit.log._id,
                    unitsCompleted: newUnitsCompleted,
                  });
                }
                router.navigate("/habits");
              } catch (error) {
                if (error instanceof Error) {
                  setError(error.message);
                }
              } finally {
                setIsPending(false);
              }
            }}
          >
            Save
          </FormSubmitButton>
        </View>
      ) : (
        <View className="mt-10 flex-1 gap-2">
          <ActivityIndicator />
        </View>
      )}
    </View>
  );
}

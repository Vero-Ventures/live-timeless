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

export default function LogChallengeProgressScreen() {
  const { id, date } = useLocalSearchParams<{
    id: Id<"challenges">;
    date: string;
  }>();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [unitsCompleted, setUnitsCompleted] = useState("");

  const selectedDate = new Date(date);

  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const day = getDate(selectedDate);

  const challenge = useQuery(
    api.challenges.getChallengeByIdWithLogForCurrentDay,
    {
      challengeId: id,
      year,
      month,
      day,
    }
  );

  const createChallengeLog = useMutation(api.challengeLogs.createChallengeLog);
  const updateChallengeLog = useMutation(api.challengeLogs.updateChallengeLog);

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
      {challenge ? (
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
              {challenge.unit}
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

                if (!challenge.log) {
                  const newLogId = await createChallengeLog({
                    challengeId: challenge._id,
                    year,
                    month,
                    day,
                    unitsCompleted: unitsCompletedNumber,
                    isComplete: unitsCompletedNumber >= challenge.unitValue,
                  });

                  if (!newLogId) {
                    throw new Error(
                      "Log couldn't be created. Please try again."
                    );
                  }
                  return router.navigate("/habits");
                }

                const newUnitsCompleted =
                  challenge.log.unitsCompleted + unitsCompletedNumber;

                if (
                  newUnitsCompleted >= challenge.unitValue &&
                  !challenge.log.isComplete
                ) {
                  await updateChallengeLog({
                    challengeLogId: challenge.log._id,
                    unitsCompleted: newUnitsCompleted,
                    isComplete: true,
                  });
                } else {
                  await updateChallengeLog({
                    challengeLogId: challenge.log._id,
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

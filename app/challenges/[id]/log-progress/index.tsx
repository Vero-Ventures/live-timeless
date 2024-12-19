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
  const day = selectedDate.getDate();

  const challenge = useQuery(
    api.challenges.getChallengeByIdWithLogForCurrentDay,
    {
      challengeId: id,
      year,
      month,
      day,
    }
  );
  const user = useQuery(api.users.currentUser);
  const createChallengeLog = useMutation(api.challengeLogs.createChallengeLog);
  const updateChallengeLog = useMutation(api.challengeLogs.updateChallengeLog);
  const updateUserTokens = useMutation(api.users.updateUserTokens);

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
      {challenge && user ? (
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
                  const isComplete =
                    unitsCompletedNumber >= challenge.unitValue;
                  const newLogId = await createChallengeLog({
                    challengeId: challenge._id,
                    year,
                    month,
                    day,
                    unitsCompleted: unitsCompletedNumber,
                    isComplete,
                  });

                  if (!newLogId) {
                    throw new Error(
                      "Log couldn't be created. Please try again."
                    );
                  }

                  if (isComplete) {
                    await updateUserTokens({
                      tokens: user.tokens + challenge.tokens,
                    });
                  }

                  return router.dismiss();
                }

                const newUnitsCompleted =
                  challenge.log.unitsCompleted + unitsCompletedNumber;
                const isComplete = newUnitsCompleted >= challenge.unitValue;

                if (isComplete && !challenge.log.isComplete) {
                  await updateChallengeLog({
                    challengeLogId: challenge.log._id,
                    unitsCompleted: newUnitsCompleted,
                    isComplete: true,
                  });

                  await updateUserTokens({
                    tokens: user.tokens + challenge.tokens,
                  });
                } else {
                  await updateChallengeLog({
                    challengeLogId: challenge.log._id,
                    unitsCompleted: newUnitsCompleted,
                  });
                }
                router.dismiss();
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

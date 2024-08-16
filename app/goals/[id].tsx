import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";
import FormSubmitButton from "~/components/form-submit-button";
import { useState } from "react";
import { Button } from "~/components/ui/button";

export default function SingleGoalsPage() {
  const { id } = useLocalSearchParams<{ id: Id<"goals"> }>();
  const goal = useQuery(api.goals.get, { goalId: id });

  if (!goal) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{ headerTitle: goal.name, headerBackTitleVisible: false }}
      />
      <View className="gap-4 p-4 h-full">
        <Text className="text-4xl font-bold">{goal.name}</Text>
        <Text className="text-3xl font-bold">{goal.description}</Text>
        <Button size="lg">
          <Text>Generate Habit Plan</Text>
        </Button>
        <DeleteGoalButton id={goal._id} />
      </View>
    </>
  );
}

function DeleteGoalButton({ id }: { id: Id<"goals"> }) {
  const [isPending, setIsPending] = useState(false);
  const deleteGoal = useMutation(api.goals.remove);
  const router = useRouter();
  return (
    <FormSubmitButton
      variant="destructive"
      isPending={isPending}
      onPress={async () => {
        try {
          setIsPending(true);
          await deleteGoal({ id });
          router.replace("/goals");
        } catch (error) {
          if (error instanceof Error) {
            console.error(error.message);
          }
        } finally {
          setIsPending(true);
        }
      }}
    >
      Delete Goal
    </FormSubmitButton>
  );
}

import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";
import FormSubmitButton from "~/components/form-submit-button";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { useChat } from "ai/react";

export default function SingleGoalsPage() {
  const { id } = useLocalSearchParams<{ id: Id<"goals"> }>();
  const goal = useQuery(api.goals.get, { goalId: id });
  let { messages, input, handleSubmit } = useChat({
    api: `${process.env.EXPO_PUBLIC_CONVEX_URL}/chat`,
  });

  if (!goal) {
    return null;
  }
  input = JSON.stringify({ name: goal.name, description: goal.description });

  console.log(input);

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: goal.name,
          headerBackTitleVisible: false,
        }}
      />
      <View className="gap-4 p-4 h-full">
        <Text className="text-4xl font-bold">{goal.name}</Text>
        <Text className="text-3xl font-bold">{goal.description}</Text>
        <Button onPress={handleSubmit} size="lg">
          <Text>Generate Habit Plan</Text>
        </Button>
        <DeleteGoalButton id={goal._id} />
        {messages.map((m) => (
          <div key={m.id} className="whitespace-pre-wrap">
            {m.role === "assistant" && m.content}
          </div>
        ))}
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

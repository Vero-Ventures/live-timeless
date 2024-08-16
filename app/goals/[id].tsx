import { ScrollView, StyleSheet, View } from "react-native";
import { Text } from "~/components/ui/text";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";
import FormSubmitButton from "~/components/form-submit-button";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import Markdown from "react-native-markdown-display";

const markdownStyles = StyleSheet.create({
  text: {
    lineHeight: 24,
    color: "#E5E7EB",
  },
  heading1: {
    fontSize: 24,
    fontWeight: "700", // equivalent to font-bold
    marginTop: 8,
    marginBottom: 8,
    color: "#E5E7EB", // text-gray-200 for better contrast on dark backgrounds
  },
  heading2: {
    fontSize: 20,
    fontWeight: "600", // equivalent to font-semibold
    marginTop: 8,
    marginBottom: 6,
    color: "#E5E7EB", // text-gray-200
  },
  heading3: {
    fontSize: 18,
    fontWeight: "600", // equivalent to font-semibold
    marginTop: 4,
    marginBottom: 4,
    color: "#E5E7EB", // text-gray-200
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12,
    color: "#D1D5DB", // text-gray-400
  },
  listItem: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 12, // Increased marginBottom for extra spacing
    color: "#D1D5DB", // text-gray-400
  },
  blockQuote: {
    fontStyle: "italic",
    borderLeftWidth: 4,
    borderLeftColor: "#374151", // border-gray-600
    paddingLeft: 12,
    marginBottom: 12,
    color: "#9CA3AF", // text-gray-500
  },
  code: {
    fontFamily: "monospace",
    backgroundColor: "#1F2937", // bg-gray-800
    padding: 4,
    borderRadius: 4,
    color: "#FBBF24", // text-yellow-400
    marginBottom: 12,
  },
  strong: {
    fontWeight: "700", // equivalent to font-bold
    color: "#E5E7EB", // text-gray-200
  },
  link: {
    color: "#3B82F6", // text-blue-400
    textDecorationLine: "underline",
  },
  image: {
    width: "100%",
    height: 200,
    marginBottom: 12,
    borderRadius: 8,
  },
  horizontalRule: {
    borderBottomWidth: 1,
    borderBottomColor: "#374151", // border-gray-600
    marginBottom: 12,
  },
});

export default function SingleGoalsPage() {
  const { id } = useLocalSearchParams<{ id: Id<"goals"> }>();
  const goal = useQuery(api.goals.get, { goalId: id });
  const generateHabitPlan = useAction(api.ai.generateHabitPlan);

  if (!goal) {
    return null;
  }

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
        <Button
          onPress={async () => {
            await generateHabitPlan({ goalId: goal._id });
          }}
          size="lg"
        >
          <Text>Generate Habit Plan</Text>
        </Button>
        <DeleteGoalButton id={goal._id} />
        {
          <ScrollView>
            <Markdown style={markdownStyles}>{goal.plan}</Markdown>
          </ScrollView>
        }
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

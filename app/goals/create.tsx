import { useMutation } from "convex/react";
import { Stack, useRouter } from "expo-router";
import { AlertCircle } from "lucide-react-native";
import { useState } from "react";
import { View } from "react-native";
import FormSubmitButton from "~/components/form-submit-button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/convex/_generated/api";

export default function CreateGoalPage() {
  return (
    <View className="gap-4 p-4">
      <Stack.Screen
        options={{ title: "Create Goal", headerBackTitleVisible: false }}
      />
      <CreateGoalForm />
    </View>
  );
}

function CreateGoalForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const createGoal = useMutation(api.goals.create);
  const router = useRouter();
  return (
    <View className="gap-4">
      {error && (
        <Alert icon={AlertCircle} variant="destructive" className="max-w-xl">
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Text>Name</Text>
      <Input placeholder="Name of Goal" value={name} onChangeText={setName} />
      <Text>Description (optional)</Text>
      <Textarea
        placeholder="Describe your goal..."
        value={description}
        onChangeText={setDescription}
        aria-labelledby="textareaLabel"
      />
      <FormSubmitButton
        size="lg"
        isPending={isPending}
        onPress={async () => {
          setError("");
          setIsPending(true);
          try {
            if (name.trim().length <= 3) {
              throw new Error("Name of the goal must be over 3 characters");
            }
            const newGoal = { name, description };
            await createGoal(newGoal);
            router.replace("/goals");
          } catch (error) {
            if (error instanceof Error) {
              setError(error.message);
            }
          } finally {
            setIsPending(false);
          }
          setDescription("");
        }}
      >
        Set Goal
      </FormSubmitButton>
    </View>
  );
}

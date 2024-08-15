import { useMutation, useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { Trash2 } from "~/lib/icons/Trash2";
import { useState } from "react";
import { FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FormSubmitButton from "~/components/form-submit-button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { Textarea } from "~/components/ui/textarea";
import { api } from "~/convex/_generated/api";

export default function Home() {
	const goals = useQuery(api.goals.listGoals);
	return (
		<SafeAreaView className="h-full">
			<View className="p-4 gap-4 h-full">
				<FlatList
					data={goals}
					ItemSeparatorComponent={() => <View className="p-2" />}
					renderItem={({ item }) => <GoalItem goal={item} />}
					keyExtractor={(g) => g._id}
				/>
				<View>
					<CreateGoalForm />
				</View>
			</View>
		</SafeAreaView>
	);
}

function GoalItem({
	goal,
}: {
	goal: FunctionReturnType<typeof api.goals.listGoals>[number];
}) {
	const [isPending, setIsPending] = useState(false);
	const deleteGoal = useMutation(api.goals.deleteGoal);
	return (
		<View className="flex gap-2 flex-row">
			<Card className="flex-1">
				<CardHeader />
				<CardContent className="flex flex-row justify-between">
					<Text className="text-lg font-bold">{goal.description}</Text>
				</CardContent>
				<CardFooter />
			</Card>
			<FormSubmitButton
				style={{
					height: "auto",
				}}
				variant="destructive"
				isPending={isPending}
				onPress={async () => {
					setIsPending(true);
					await deleteGoal({ id: goal._id });
					setIsPending(false);
				}}
			>
				<Trash2 className="text-foreground" />
			</FormSubmitButton>
		</View>
	);
}

function CreateGoalForm() {
	const [description, setDescription] = useState("");
	const [isPending, setIsPending] = useState(false);
	const createGoal = useMutation(api.goals.createGoal);
	return (
		<View className="gap-4">
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
					if (description.trim().length <= 3) {
						return;
					}
					setIsPending(true);
					await createGoal({ description });
					setIsPending(false);
					setDescription("");
				}}
			>
				Create Goal
			</FormSubmitButton>
		</View>
	);
}

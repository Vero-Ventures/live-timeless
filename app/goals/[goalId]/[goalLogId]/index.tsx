import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useMutation, useQuery } from "convex/react";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { Alert, Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";
import { fontFamily } from "~/lib/font";
import * as DropdownMenu from "zeego/dropdown-menu";
import { useState, useEffect } from "react";

export default function GoalScreen() {
  const { goalId, goalLogId } = useLocalSearchParams<{ goalId: Id<"goals">, goalLogId: Id<"goalLogs"> }>();

  const goal = useQuery(api.goals.getGoalById, { goalId });
  const goalLog = useQuery(api.goalLogs.getGoalLogById, { goalLogId });  
  const goalLogs = useQuery(api.goalLogs.getGoalLogsbyGoalId, { goalId });

  const deleteGoalAndGoalLogs = useMutation(api.goals.deleteGoalAndGoalLogs);

  const [progress, setProgress] = useState<number>(0);

  

  useEffect(() => {
    if (goalLogs) {
      const totalLogs = goalLogs.length;
      const completedLogs = goalLogs.filter((log) => log.isComplete).length;
      
      const percentage = totalLogs > 0 ? (completedLogs / totalLogs) * 100 : 0;
      setProgress(percentage);
    }
  }, [goalLogs]);

  const handleDelete = async () => {
    Alert.alert(
      `Are you sure you want to delete ${goal?.name}?`,
      "This action cannot be undone.",
      [
        {
          text: "Yes",
          onPress: async () => {
            await deleteGoalAndGoalLogs({ goalId });
            router.dismiss();
          },
          style: "destructive",
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  const handleStartGoal = () => {
    router.push({
      pathname: "/goals/[goalId]/[goalLogId]/start",
      params: { goalId, goalLogId },
    });
  };

  return (
    <View className="h-full gap-4 bg-background p-4">
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff",
          headerTitle: () => (
            <Text
              className="text-xl"
              style={{ fontFamily: fontFamily.openSans.bold }}
            >
              {goal ? goal.name : "Goal"}
            </Text>
          ),
          headerBackTitleVisible: false,
          headerRight: () => (
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <Pressable hitSlop={20}>
                  <FontAwesome5 name="ellipsis-h" size={20} color="#fff" />
                </Pressable>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content
                key="actions"
                placeholder=""
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
              >
                <DropdownMenu.Item
                  onSelect={() =>
                    router.navigate({
                      pathname: "/goals/[goalId]/edit",
                      params: { goalId },
                    })
                  }
                  key="edit-goal"
                  textValue="Edit Goal"
                  placeholder=""
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                >
                  <DropdownMenu.ItemIcon ios={{ name: "pencil.line" }} />
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item
                  onSelect={handleDelete}
                  destructive
                  key="delete-goal"
                  textValue="Delete Goal"
                  placeholder=""
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                >
                  <DropdownMenu.ItemIcon ios={{ name: "trash" }} />
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>
          ),
        }}
      />

      <View className="bg-gray-700 p-4 rounded-lg my-4">
        <Text className="text-white text-base" style={{ fontFamily: fontFamily.openSans.medium }}>
          Progress: {progress.toFixed(2)}%
        </Text>
        <Text className="text-gray-400 text-sm">
          You have completed {goalLogs?.filter((log) => log.isComplete).length} of {goalLogs?.length} logs.
        </Text>
      </View>

      <Pressable
        className={`mt-5 p-3 rounded-lg items-center ${goalLog?.isComplete ? "bg-gray-400" : "bg-[#299240]"}`}
        onPress={goalLog?.isComplete ? null : handleStartGoal} // Disable press if goalLog is complete
        disabled={goalLog?.isComplete} // Disable the button if the goalLog is complete
      >
        <Text className="text-white text-base" style={{ fontFamily: fontFamily.openSans.bold }}>
          {goalLog?.isComplete ? "Goal Log Completed" : "Start Goal"}
        </Text>
      </Pressable>
    </View>
  );
}


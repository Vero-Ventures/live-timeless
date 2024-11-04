import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useMutation, useQuery } from "convex/react";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { Alert, Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";
import { fontFamily } from "~/lib/font";
import * as DropdownMenu from "zeego/dropdown-menu"; // TODO: Remove @ts-ignore lines when zeego is fixed
import { useState, useEffect } from "react";
import { ArrowRight, Check, Flame, MoveRight, X } from "lucide-react-native";
import { StatCard } from "~/components/ui/statCard";
import Calendar from "~/components/ui/calendar";

const progressData = [
  10, 20, 30, 50, 60, 80, 0, 90, 75, 30, 50, 20, 40, 60, 80, 100, 90, 75, 0,
  50, 20, 40, 60, 80, 100, 90, 75, 30, 0, 0, 0,
];

export default function GoalScreen() {
  const { goalId, goalLogId } = useLocalSearchParams<{
    goalId: Id<"goals">;
    goalLogId: Id<"goalLogs">;
  }>();

  // Fetch goal and goal logs
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
              {/* @ts-ignore */}
              <DropdownMenu.Content
                key="actions"
                role="menu"
                placeholder=""
                onPointerEnterCapture={() => {}}
                onPointerLeaveCapture={() => {}}
              >
                {/* @ts-ignore */}
                <DropdownMenu.Item
                  onSelect={() =>
                    router.navigate({
                      pathname: "/goals/[goalId]/log-history",
                      params: { goalId },
                    })
                  }
                  key="log-history"
                  textValue="Log History"
                  placeholder=""
                  onPointerEnterCapture={() => {}}
                  onPointerLeaveCapture={() => {}}
                >
                  <DropdownMenu.ItemIcon ios={{ name: "list.bullet" }} />
                </DropdownMenu.Item>

                <DropdownMenu.Separator />
                {/* @ts-ignore */}
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
                {/* @ts-ignore */}
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

      {/* <View className="my-4 rounded-lg bg-gray-700 p-4">
        <Text
          className="text-base text-white"
          style={{ fontFamily: fontFamily.openSans.medium }}
        >
          Progress: {progress.toFixed(2)}%
        </Text>
        <Text className="text-sm text-gray-400">
          You have completed {goalLogs?.filter((log) => log.isComplete).length}{" "}
          of {goalLogs?.length} logs.
        </Text>
      </View> */}
      <View className="flex flex-row items-center gap-4 rounded-xl border border-gray-600 p-4">
        <FontAwesome5 name="fire" size={36} color="#f9a825" />
        <View className="flex flex-col gap-2">
          <Text className="uppercase text-gray-400">Current Streak</Text>
          <Text className="text-lg font-bold">0 days</Text>
        </View>
      </View>

      <View className="gap-4">
        <View className="flex w-full flex-row gap-4">
          <StatCard
            titleIcon={<Check size={16} color="grey" />}
            title="Success"
            value="0 Days"
            comparison="---"
            status="neutral"
          />

          <StatCard
            titleIcon={<X size={16} color="grey" />}
            title="Failed"
            value="0 Days"
            comparison="---"
            status="neutral"
          />
        </View>
        <View className="flex w-full flex-row gap-4">
          <StatCard
            titleIcon={<ArrowRight size={16} color="grey" />}
            title="Skipped"
            value="0 Days"
            comparison="---"
            status="neutral"
          />

          <StatCard
            title="Total"
            value="26.02 Minutes"
            comparison="26.02min"
            status="positive"
          />
        </View>
      </View>

      <Calendar progressData={progressData} selectedDate={new Date()} />
      <Pressable
        className={`mt-5 items-center rounded-lg p-3 ${
          goalLog?.isComplete ? "bg-gray-400" : "bg-[#299240]"
        }`}
        onPress={goalLog?.isComplete ? null : handleStartGoal} // Disable press if goalLog is complete
        disabled={goalLog?.isComplete} // Disable the button if the goalLog is complete
      >
        <Text
          className="text-base text-white"
          style={{ fontFamily: fontFamily.openSans.bold }}
        >
          {goalLog?.isComplete ? "Goal Log Completed" : "Log Progress"}
        </Text>
      </Pressable>
    </View>
  );
}

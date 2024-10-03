import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useQuery } from "convex/react";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";
import { fontFamily } from "~/lib/font";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";

export default function GoalScreen() {
  const { goalId } = useLocalSearchParams<{ goalId: Id<"goals"> }>();
  const goal = useQuery(api.goals.getGoalById, { goalId });
  const router = useRouter();

  return (
    <View className="h-full gap-4 bg-background p-4">
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff",
          headerTitle: "",
          headerLeft: () => (
            <Pressable
              className="flex flex-row items-center justify-center"
              hitSlop={20}
              onPress={() => router.navigate("/goals")}
            >
              <ChevronLeft color="#fff" size={35} />
              <Text
                className="text-xl"
                style={{ fontFamily: fontFamily.openSans.bold }}
              >
                {goal ? goal.name : "Goal"}
              </Text>
            </Pressable>
          ),
          headerRight: () => (
            <Pressable
              className="rounded-full bg-[#fff] p-1"
              hitSlop={20}
              onPress={() =>
                router.navigate(`/goals/edit-goal-page?goalId=${goalId}`)
              }
            >
              <FontAwesome5 name="ellipsis-h" size={16} color="#0b1a28" />
            </Pressable>
          ),
        }}
      />
    </View>
  );
}

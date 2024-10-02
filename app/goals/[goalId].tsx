import { useQuery } from "convex/react";
import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import { Id } from "~/convex/_generated/dataModel";
import { fontFamily } from "~/lib/font";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";

export default function GoalScreen() {
  const { goalId } = useLocalSearchParams<{ goalId: Id<"goals"> }>();
  const goal = useQuery(api.goals.getGoalById, { goalId });

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
            <View className="flex flex-row items-center justify-center">
              <ChevronLeft color="#fff" size={35} />
              <Text
                className="text-xl"
                style={{ fontFamily: fontFamily.openSans.bold }}
              >
                {goal?.name}
              </Text>
            </View>
          ),
        }}
      />
    </View>
  );
}

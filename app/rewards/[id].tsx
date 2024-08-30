import { Stack, useLocalSearchParams } from "expo-router";
import { View } from "react-native";
import { rewardData } from "../(tabs)/rewards";

export default function SingleRewardsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const reward = rewardData.find((reward) => reward.id === id);
  if (!reward) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: reward.name,
          headerBackTitleVisible: false,
        }}
      />
      <View className="h-full gap-4 p-4"></View>
    </>
  );
}

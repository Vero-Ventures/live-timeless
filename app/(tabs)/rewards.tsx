import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "~/components/ui/text";
import SearchInput from "~/components/search-input";
import { Coins } from "~/lib/icons/Coins";

export default function RewardsPage() {
  return (
    <SafeAreaView className="h-full">
      <View className="gap-10 p-4">
        <View className="flex flex-row items-center gap-4">
          <Text>
            <Coins size={40} />
          </Text>
          <View className="gap-2">
            <Text className="text-2xl font-bold">100</Text>
            <Text className="text-md">LT Token Balance</Text>
          </View>
        </View>
        <View className="gap-3">
          <Text className="text-2xl font-semibold">Available Rewards</Text>
          <SearchInput />
        </View>
      </View>
    </SafeAreaView>
  );
}

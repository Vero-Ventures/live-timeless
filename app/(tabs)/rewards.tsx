import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "~/components/ui/text";

export default function RewardsPage() {
  return (
    <SafeAreaView className="h-full">
      <View className="h-full gap-4 p-4">
        <Text>Rewards Page</Text>
      </View>
    </SafeAreaView>
  );
}

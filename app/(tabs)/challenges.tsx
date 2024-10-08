import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "~/components/ui/text";

export default function ChallengesScreen() {
  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "#082139" }}>
      <View className="h-full gap-4 p-4">
        <Text>Challenges</Text>
      </View>
    </SafeAreaView>
  );
}

import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "~/components/ui/text";

export default function HomePage() {
  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "#082139" }}>
      <View className="p-4 gap-4 h-full">
        <Text>Home Page</Text>
      </View>
    </SafeAreaView>
  );
}

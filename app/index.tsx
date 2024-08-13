import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomePage() {
  return (
    <SafeAreaView className="h-full">
      <View className="h-full p-4">
        <Text className="text-foreground">Testing</Text>
      </View>
    </SafeAreaView>
  );
}

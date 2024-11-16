import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";
import { Text } from "~/components/ui/text";

export default function AiAdvisor() {
  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "#082139" }}>
      <View>
        <Text>AI Advisor</Text>
      </View>
    </SafeAreaView>
  );
}

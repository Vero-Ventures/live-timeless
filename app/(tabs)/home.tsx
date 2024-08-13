import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";

export default function Home() {
  return (
    <SafeAreaView>
      <View>
        <Text>Home</Text>
      </View>
    </SafeAreaView>
  );
}

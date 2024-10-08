import { Text, Pressable } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { fontFamily } from "~/lib/font";

export default function PrivacyPolicyButton() {
  const handlePress = async () => {
    await WebBrowser.openBrowserAsync(
      "https://livetimeless.com/privacy-policy/",
      {
        readerMode: true,
        enableBarCollapsing: true,
      }
    );
  };

  return (
    <Pressable onPress={handlePress}>
      <Text
        className="text-sm text-blue-500"
        style={{
          fontFamily: fontFamily.openSans.regular,
        }}
      >
        Privacy Policy
      </Text>
    </Pressable>
  );
}

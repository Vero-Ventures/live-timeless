import { SafeAreaView } from "react-native-safe-area-context";

import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Button } from "~/components/ui/button";

export default function AdvisorChatbot() {
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "#082139" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-3 py-2"
          onContentSizeChange={() => {
            if (scrollViewRef.current) {
              scrollViewRef.current.scrollToEnd({ animated: true });
            }
          }}
        >
          <Message text="Hello World" isAssistant={false} />
          <Message
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            isAssistant={true}
          />
          <Message text="Hello World" isAssistant={false} />
          <Message
            text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            isAssistant={true}
          />
        </ScrollView>

        <View className="flex-row border-t border-gray-200 bg-white p-2">
          <TextInput
            className="mr-2 max-h-24 flex-1 rounded-full border border-gray-300 bg-white px-4 py-2"
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            placeholderTextColor="#666666"
            multiline
          />
          <Button className="items-center justify-center rounded-full bg-blue-500 p-3">
            <Text className="text-base font-bold text-white">Send</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Message({
  text,
  isAssistant,
}: {
  text: string;
  isAssistant: boolean;
}) {
  return (
    <View
      className={`my-1 max-w-[80%] rounded-2xl p-3 ${
        isAssistant
          ? "self-start rounded-bl-sm bg-blue-100"
          : "self-end rounded-br-sm bg-blue-500"
      }`}
    >
      <Text
        className={`text-base ${isAssistant ? "text-gray-800" : "text-white"}`}
      >
        {text}
      </Text>
    </View>
  );
}

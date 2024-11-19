import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useState, useRef, useEffect, useMemo } from "react";
import {
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";

export default function AdvisorChatbot() {
  const sessionId = useSessionId();
  const remoteMessages = useQuery(api.messages.list, { sessionId });
  const sendMessage = useMutation(api.messages.send);
  const messages = useMemo(
    () =>
      [
        {
          isViewer: false,
          text: "Hey there, I'm your personal AI Advisor. What can I help you with?",
          _id: "0",
        },
      ].concat(remoteMessages ?? []),
    [remoteMessages]
  );

  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    await sendMessage({ message: inputText, sessionId });
    setInputText("");
  };

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
          {!!remoteMessages &&
            messages.map((message) => (
              <Message
                key={message._id}
                text={message.text}
                isViewer={message.isViewer}
              />
            ))}
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
          <Button
            className="items-center justify-center rounded-full bg-blue-500 p-3"
            onPress={handleSend}
          >
            <Text className="text-base font-bold text-white">Send</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Message({ text, isViewer }: { text: string; isViewer: boolean }) {
  return (
    <View
      className={`my-1 max-w-[80%] rounded-2xl p-3 ${
        isViewer
          ? "self-end rounded-br-sm bg-blue-500"
          : "self-start rounded-bl-sm bg-blue-100"
      }`}
    >
      <Text
        className={`text-base ${isViewer ? "text-white" : "text-gray-800"}`}
      >
        {text}
      </Text>
    </View>
  );
}

const STORE_KEY = "ConvexSessionId";
function useSessionId() {
  const [sessionId, setSessionId] = useState("");

  useEffect(() => {
    const getSessionId = async () => {
      try {
        const storedSessionId = await AsyncStorage.getItem(STORE_KEY);
        if (storedSessionId !== null) {
          setSessionId(storedSessionId);
        } else {
          const newSessionId = `${generateRandom8DigitNumber()}`;
          await AsyncStorage.setItem(STORE_KEY, newSessionId);
          setSessionId(newSessionId);
        }
      } catch (error) {
        console.error("Error retrieving sessionId:", error);
      }
    };

    getSessionId();
  }, []);

  return sessionId;
}

function generateRandom8DigitNumber() {
  const min = 10000000;
  const max = 99999999;

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

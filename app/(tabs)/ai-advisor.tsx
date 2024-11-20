import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useState, useRef, useEffect, useMemo } from "react";
import type { ScrollView } from "react-native";
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { cn } from "~/lib/utils";
import { Send } from "~/lib/icons/Send";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";

interface Message {
  isViewer: boolean;
  text: string;
  _id: string;
}

const messages: Message[] = [
  {
    isViewer: false,
    text: "Hey there, I'm your personal AI Advisor. What can I help you with?",
    _id: "0",
  },
  {
    isViewer: true,
    text: "What is the capital of Canada?",
    _id: "1",
  },
  {
    isViewer: false,
    text: "The capital of Canada is Ottawa.",
    _id: "2",
  },
];

export default function AdvisorChatbot() {
  // const sessionId = useSessionId();
  // const remoteMessages = useQuery(api.messages.list, { sessionId });
  // const sendMessage = useMutation(api.messages.send);
  // const messages = useMemo(
  //   () =>
  //     [
  //       {
  //         isViewer: false,
  //         text: "Hey there, I'm your personal AI Advisor. What can I help you with?",
  //         _id: "0",
  //       },
  //     ].concat(remoteMessages ?? []),
  //   [remoteMessages]
  // );

  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  // const handleSend = async () => {
  //   await sendMessage({ message: inputText, sessionId });
  //   setInputText("");
  // };

  return (
    <SafeAreaView className="h-full bg-background">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <FlatList
          ref={flatListRef}
          data={messages}
          onContentSizeChange={() => {
            if (flatListRef.current) {
              flatListRef.current.scrollToEnd({ animated: true });
            }
          }}
          renderItem={({ item }) => (
            <MessageComp isViewer={item.isViewer} text={item.text} />
          )}
          contentContainerStyle={{ flexGrow: 1 }}
          ItemSeparatorComponent={() => <Separator />}
        />

        <View className="relative">
          <Input
            className="native:h-20 rounded-none border-0 bg-card py-6"
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type your message..."
            multiline
          />
          <Button
            variant="ghost"
            className="absolute right-1 top-5 items-center justify-center p-3"
            // onPress={handleSend}
          >
            <Send className="text-white" />
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function MessageComp({ text, isViewer }: { text: string; isViewer: boolean }) {
  return (
    <View className={cn("p-4", isViewer && "bg-card")}>
      <Text className={cn(!isViewer && "font-semibold")}>{text}</Text>
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

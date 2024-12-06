import { SafeAreaView } from "react-native-safe-area-context";
// import AsyncStorage from "@react-native-async-storage/async-storage";

import { useState, useRef, useMemo } from "react";
import { View, KeyboardAvoidingView, Platform, FlatList } from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { cn } from "~/lib/utils";
import { Send } from "~/lib/icons/Send";
import { Input } from "~/components/ui/input";
import { Separator } from "~/components/ui/separator";

export default function AdvisorChatbot() {
  const thread = useQuery(api.threads.getThread);
  const remoteMessages = useQuery(api.messages.getMessages, {
    threadId: thread?.threadId,
  });
  const sendMessage = useMutation(api.messages.sendMessage);

  const messages = useMemo(
    () =>
      [
        {
          role: "assistant",
          content:
            "Hey there, I'm your personal AI Advisor. What can I help you with?",
          threadId: "",
        },
      ].concat(remoteMessages ?? []),
    [remoteMessages]
  );

  const [inputText, setInputText] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const handleSend = async () => {
    if (!inputText) {
      return;
    }
    await sendMessage({ threadId: thread?.threadId, message: inputText });
    setInputText("");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#082139" }}
      edges={["top", "left", "right"]}
    >
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
            <MessageComp isViewer={item.role === "user"} text={item.content} />
          )}
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
            onPress={handleSend}
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

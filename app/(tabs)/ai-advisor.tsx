import { SafeAreaView } from "react-native-safe-area-context";
import Markdown from "react-native-markdown-display";

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
import { ThumbsUp } from "~/lib/icons/ThumbsUp";
import { ThumbsDown } from "~/lib/icons/ThumbsDown";

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

        <View className="relative flex-row items-center justify-between bg-card">
          <Input
            className="native:h-20 flex-1 rounded-none border-0 bg-card py-6 placeholder:text-muted-foreground"
            value={inputText}
            onChangeText={setInputText}
            placeholder="Send a message..."
            multiline
          />
          <Button variant="ghost" hitSlop={20} onPress={handleSend}>
            <Send className="text-white" />
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function MessageComp({ text, isViewer }: { text: string; isViewer: boolean }) {
  return (
    <View className={cn("gap-3 p-4", isViewer && "bg-card")}>
      <Markdown
        style={{
          body: { color: "#fafafa" },
        }}
      >
        {text}
      </Markdown>
      {!!isViewer && (
        <Text className="text-right text-sm font-light text-muted-foreground">
          You
        </Text>
      )}
      {!isViewer && (
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-light text-muted-foreground">
            LT AI Advisor
          </Text>
          <View className="flex-row gap-8">
            <Text>
              {!isViewer && (
                <ThumbsUp className="text-muted-foreground" size={20} />
              )}
            </Text>
            <Text className="mr-4">
              {!isViewer && (
                <ThumbsDown className="text-muted-foreground" size={20} />
              )}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

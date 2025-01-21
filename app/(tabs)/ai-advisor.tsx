import { SafeAreaView } from "react-native-safe-area-context";
import Markdown from "react-native-markdown-display";
import Toast from "react-native-toast-message";

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
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import type { LucideIcon } from "lucide-react-native";

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
            <ThumbsUpFeedbackDialog icon={ThumbsUp} />
            <View className="mr-4">
              <ThumbsDownFeedbackDialog icon={ThumbsDown} />
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

function ThumbsUpFeedbackDialog({ icon: Icon }: { icon: LucideIcon }) {
  const [isCorrect, setIsCorrect] = useState(false);
  const [isEasyToUnderstand, setIsEasyToUnderstand] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = () => {
    if (!isCorrect && !isEasyToUnderstand && !isComplete) {
      return;
    }
    setIsCorrect(false);
    setIsEasyToUnderstand(false);
    setIsComplete(false);

    Toast.show({
      type: "success",
      text1: "Thank you for your feedback!",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Icon className="text-muted-foreground" size={20} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="native:text-xl">
            Why did you choose this rating?
          </DialogTitle>
          <View className="mt-5 flex-row flex-wrap gap-3">
            <Button
              className="rounded-lg border border-gray-400 p-2 text-muted-foreground"
              variant={isCorrect ? "default" : "outline"}
              onPress={() => setIsCorrect(!isCorrect)}
            >
              <Text className="native:text-md font-semibold tracking-wider">
                Correct
              </Text>
            </Button>
            <Button
              className="rounded-lg border border-gray-400 p-2 text-muted-foreground"
              variant={isEasyToUnderstand ? "default" : "outline"}
              onPress={() => setIsEasyToUnderstand(!isEasyToUnderstand)}
            >
              <Text className="native:text-md font-semibold tracking-wider">
                Easy To Understand
              </Text>
            </Button>
            <Button
              className="rounded-lg border border-gray-400 p-2 text-muted-foreground"
              variant={isComplete ? "default" : "outline"}
              onPress={() => setIsComplete(!isComplete)}
            >
              <Text className="native:text-md font-semibold tracking-wider">
                Complete
              </Text>
            </Button>
          </View>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="ml-auto flex-wrap"
              variant="ghost"
              disabled={!isCorrect && !isEasyToUnderstand && !isComplete}
              onPress={handleSubmit}
            >
              <Text>Submit</Text>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ThumbsDownFeedbackDialog({ icon: Icon }: { icon: LucideIcon }) {
  const [isOffensive, setIsOffensive] = useState(false);
  const [isNotFactuallyCorrect, setIsNotFactuallyCorrect] = useState(false);
  const [isOther, setIsOther] = useState(false);

  const handleSubmit = () => {
    if (!isOffensive && !isNotFactuallyCorrect && !isOther) {
      return;
    }
    setIsOffensive(false);
    setIsNotFactuallyCorrect(false);
    setIsOther(false);

    Toast.show({
      type: "success",
      text1: "Thank you for your feedback!",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Icon className="text-muted-foreground" size={20} />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="native:text-xl">
            Why did you choose this rating?
          </DialogTitle>
          <View className="mt-5 flex-row flex-wrap gap-3">
            <Button
              className="rounded-lg border border-gray-400 p-2 text-muted-foreground"
              variant={isOffensive ? "default" : "outline"}
              onPress={() => setIsOffensive(!isOffensive)}
            >
              <Text className="native:text-md font-semibold tracking-wider">
                Offensive / Unsafe
              </Text>
            </Button>
            <Button
              className="rounded-lg border border-gray-400 p-2 text-muted-foreground"
              variant={isNotFactuallyCorrect ? "default" : "outline"}
              onPress={() => setIsNotFactuallyCorrect(!isNotFactuallyCorrect)}
            >
              <Text className="native:text-md font-semibold tracking-wider">
                Not factually correct
              </Text>
            </Button>
            <Button
              className="rounded-lg border border-gray-400 p-2 text-muted-foreground"
              variant={isOther ? "default" : "outline"}
              onPress={() => setIsOther(!isOther)}
            >
              <Text className="native:text-md font-semibold tracking-wider">
                Other
              </Text>
            </Button>
          </View>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              className="ml-auto flex-wrap"
              variant="ghost"
              disabled={!isOffensive && !isNotFactuallyCorrect && !isOther}
              onPress={handleSubmit}
            >
              <Text>Submit</Text>
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

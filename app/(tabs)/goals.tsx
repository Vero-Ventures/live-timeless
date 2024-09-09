import { useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { FlatList, Pressable, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import { Button } from "~/components/ui/button";
import { Link } from "expo-router";
import { useUserProfile } from "~/providers/kindeUserProfileProvider";
import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { fontFamily } from "~/lib/font";
import { Plus } from "lucide-react-native";
import { Separator } from "~/components/ui/separator";

export default function GoalsPage() {
  const { user: userProfile } = useUserProfile();
  const goals = useQuery(api.goals.list, { userId: userProfile?.id ?? "" });
  const { today, tomorrow, yesterday } = getTodayYesterdayTomorrow();
  const [selectedDate, setSelectedDate] = useState(today);

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "#082139" }}>
      <View className="flex h-full justify-between">
        <View className="flex-1 px-4">
          <Text className="mb-2 text-sm uppercase text-gray-500">
            {selectedDate.toDateString() === today.toDateString()
              ? "Today"
              : selectedDate.toDateString() === yesterday.toDateString()
                ? "Yesterday"
                : selectedDate.toDateString() === tomorrow.toDateString()
                  ? "Tomorrow"
                  : selectedDate.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    })}
          </Text>
          <Text
            className="text-2xl"
            style={{
              fontFamily: fontFamily.openSans.bold,
            }}
          >
            Goals
          </Text>
          <FlatList
            data={goals}
            ItemSeparatorComponent={() => <View className="p-2" />}
            renderItem={({ item }) => <GoalItem goal={item} />}
            keyExtractor={(g) => g._id}
          />
        </View>
        <View className="mb-20 flex-row items-center gap-2 bg-[#0b1a28] px-4">
          <CalendarStrip
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
          />
          <Separator orientation="vertical" className="mx-2" />
          <Link href="/goals/create" asChild>
            <Button size="icon" className="h-14 w-14 rounded-full">
              <Plus color="#fff" size={30} />
            </Button>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

function GoalItem({
  goal,
}: {
  goal: FunctionReturnType<typeof api.goals.list>[number];
}) {
  return (
    <Link
      href={{
        pathname: "/goals/[id]",
        params: { id: goal._id },
      }}
      asChild
    >
      <Pressable>
        <Card>
          <CardHeader />
          <CardContent>
            <Text className="text-lg font-bold">{goal.name}</Text>
          </CardContent>
          <CardFooter />
        </Card>
      </Pressable>
    </Link>
  );
}

function CalendarStrip({
  selectedDate,
  setSelectedDate,
}: {
  selectedDate: Date;
  setSelectedDate: Dispatch<SetStateAction<Date>>;
}) {
  const scrollViewRef = useRef<ScrollView>(null);
  const { tomorrow } = getTodayYesterdayTomorrow();
  const dates = Array.from({ length: 17 }, (_, i) => {
    const date = new Date(tomorrow);
    date.setDate(tomorrow.getDate() - i);
    return date;
  }).reverse();

  useEffect(() => {
    const id = setTimeout(() => {
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ x: 15 * 63, animated: true });
      }
    }, 100);
    return () => clearTimeout(id);
  }, []);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="py-4"
      ref={scrollViewRef}
    >
      {dates.map((date, index) => (
        <Pressable
          key={index}
          className={`mx-2 items-center ${
            date.toDateString() === selectedDate.toDateString()
              ? "rounded-md bg-primary p-2"
              : "p-2"
          }`}
          onPress={() => setSelectedDate(date)}
        >
          <Text className="text-sm">
            {date.toLocaleDateString("en-US", { weekday: "short" })}
          </Text>
          <View className="w-14 items-center justify-center">
            <Text className="text-sm font-bold">{date.getDate()}</Text>
          </View>
        </Pressable>
      ))}
    </ScrollView>
  );
}

function getTodayYesterdayTomorrow() {
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  return { today, tomorrow, yesterday };
}

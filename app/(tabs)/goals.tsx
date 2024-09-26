import { FlatList, Pressable, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Link } from "expo-router";
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
import { cn } from "~/lib/utils";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useQuery, useMutation } from "convex/react"; 
import { api } from "~/convex/_generated/api";
import { Doc } from "~/convex/_generated/dataModel";
import { Trash2 } from "lucide-react-native"; // Import any icon, or just use text "X"

export default function GoalsPage() {
  const { today, tomorrow, yesterday } = getTodayYesterdayTomorrow();
  const [selectedDate, setSelectedDate] = useState(today);

  const goals = useQuery(api.goals.listGoals);

  if (!goals) {
    return <Text>Loading...</Text>; 
  }

  if (goals.length === 0) {
    return <Text>No goals found</Text>;
  }

  return (
    <SafeAreaView
      style={{
        height: "100%",
        backgroundColor: "#082139",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <View className="goals-container px-4">
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
          contentContainerStyle={{
            paddingBottom: 60,
          }}
          className="mt-6 border-t border-t-[#fff]/10 pt-6"
          data={goals}  // Use fetched goals here
          ItemSeparatorComponent={() => (
            <View className="my-4 ml-14 mr-6 h-0.5 bg-[#fff]/10" />
          )}
          renderItem={({ item }) => <GoalItem goal={item} />}  // Render dynamic goals
          keyExtractor={(goal) => goal._id.toString()}  // Use _id as key
        />
      </View>
      <View className="flex-row items-center gap-2 bg-[#0f2336] px-4">
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
    </SafeAreaView>
  );
}

function GoalItem({ goal }: { goal: Doc<"goals"> }) {
  const deleteGoal = useMutation(api.goals.deleteGoal); // Mutation for deleting goal

  const handleDelete = async () => {
    try {
      await deleteGoal({ goalId: goal._id }); // Trigger delete mutation
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  return (
    <Pressable>
      <View className="flex-row items-center gap-4">
        <View
          className={cn("items-center justify-center rounded-full bg-[#299240]/20 p-1")}
        >
          <MaterialCommunityIcons
            name={(goal.selectedIcon || "meditation") as keyof typeof MaterialCommunityIcons.glyphMap}
            color={goal.selectedIconColor || "#299240"}
          />
        </View>
        <View className="flex-1 flex-row items-center justify-between">
          <View className="gap-2">
            <Text style={{ fontFamily: fontFamily.openSans.medium }}>
              {goal.name}
            </Text>
            <Text className="text-xs text-muted-foreground">
              {goal.timeOfDay?.join(", ") || "No time specified"}
            </Text>
          </View>
          {/* Delete Button */}
          <Pressable onPress={handleDelete}>
            <Trash2 color="#f00" size={18} />
          </Pressable>
        </View>
      </View>
    </Pressable>
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
          className={cn("mx-2 items-center", {
            "rounded-md bg-primary/50 p-2":
              date.toDateString() === selectedDate.toDateString(),
            "p-2": date.toDateString() !== selectedDate.toDateString(),
          })}
          onPress={() => setSelectedDate(date)}
        >
          <Text
            style={{
              fontFamily: fontFamily.openSans.bold,
            }}
            className={cn("text-sm uppercase", {
              "text-[#fff]/50":
                date.toDateString() !== selectedDate.toDateString(),
            })}
          >
            {date.toLocaleDateString("en-US", { weekday: "short" })}
          </Text>
          <View className="w-14 items-center justify-center">
            <Text
              style={{
                fontFamily: fontFamily.openSans.bold,
              }}
              className={cn("text-sm", {
                "text-[#fff]/50":
                  date.toDateString() !== selectedDate.toDateString(),
              })}
            >
              {date.getDate()}
            </Text>
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

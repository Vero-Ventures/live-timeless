import {
  FlatList,
  Pressable,
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { Link, SplashScreen, router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { CheckIcon, Plus } from "lucide-react-native";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";
import { useMutation, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import { HABIT_ICONS } from "~/constants/habit-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { FunctionReturnType } from "convex/server";
import { addDays, getDate, isToday, isTomorrow, isYesterday } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

type Habit = NonNullable<
  FunctionReturnType<typeof api.habits.listHabits>
>[number];

export default function HabitsPage() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <SafeAreaView
      style={{
        height: "100%",
        backgroundColor: "#082139",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <View className="habit-container">
        <DateHeading />
        <Text className="ml-4 text-2xl font-bold">Habits</Text>
        <Separator className="mt-6 bg-[#fff]/10" />
        <HabitList />
      </View>
      <View className="flex-row items-center gap-2 bg-[#0f2336] px-4">
        <CalendarStrip />
        <Separator className="mr-2" orientation="vertical" />
        <Link href="/habits/create" asChild>
          <Button size="icon" className="h-14 w-14 rounded-full">
            <Plus color="#fff" size={30} />
          </Button>
        </Link>
      </View>
    </SafeAreaView>
  );
}

function DateHeading() {
  const { date } = useLocalSearchParams<{ date?: string }>();
  const today = new Date();
  const selectedDate = date ? new Date(Number(date)) : today;

  return (
    <Text className="mb-2 ml-4 text-sm uppercase text-gray-500">
      {isToday(selectedDate)
        ? "Today"
        : isYesterday(selectedDate)
          ? "Yesterday"
          : isTomorrow(selectedDate)
            ? "Tomorrow"
            : selectedDate.toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
    </Text>
  );
}
function HabitList() {
  const { date } = useLocalSearchParams<{ date?: string }>();
  const today = new Date();
  const selectedDate = date ? new Date(Number(date)) : today;
  const habits = useQuery(api.habits.listHabits, {
    date: selectedDate.toDateString(),
  });

  const { completedHabits, notCompletedHabits } = useMemo(() => {
    let notCompletedHabits: Habit[] = [];
    let completedHabits: Habit[] = [];

    habits?.forEach((h) =>
      h.log?.isComplete ? completedHabits.push(h) : notCompletedHabits.push(h)
    );
    return { notCompletedHabits, completedHabits };
  }, [habits]);

  return !habits ? (
    <View className="mt-10 flex-1 gap-2">
      <ActivityIndicator />
    </View>
  ) : habits.length === 0 ? (
    <View className="h-full justify-center gap-6 px-4">
      <Text className="text-center text-2xl font-bold">
        Welcome to Live Timeless!
      </Text>
      <Text className="text-center">
        Our habit tracker shows your progress day by day. Unlock your potential
        and start your journey today!
      </Text>
      <Link href="/habits/create" asChild>
        <Button>
          <Text>Build a habit</Text>
        </Button>
      </Link>
    </View>
  ) : (
    <>
      <View>
        <FlatList
          data={notCompletedHabits}
          ItemSeparatorComponent={() => (
            <Separator className="h-0.5 bg-[#fff]/10" />
          )}
          renderItem={({ item }) => (
            <HabitItem habit={item} selectedDate={selectedDate} />
          )}
          keyExtractor={(item) => item._id.toString()}
        />
      </View>
      <View className="flex-1">
        <Accordion type="multiple" collapsible defaultValue={["item-1"]}>
          <AccordionItem value="item-1" className="border-0">
            <AccordionTrigger className="px-4">
              <Text className="my-4 text-xl font-bold">{`Completed (${completedHabits?.length})`}</Text>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <FlatList
                data={completedHabits}
                ItemSeparatorComponent={() => (
                  <Separator className="h-0.5 bg-[#fff]/10" />
                )}
                renderItem={({ item }) => (
                  <HabitItem habit={item} selectedDate={selectedDate} />
                )}
                keyExtractor={(item) => item._id.toString()}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </View>
    </>
  );
}

function HabitItem({
  habit,
  selectedDate,
}: {
  habit: Habit;
  selectedDate: Date;
}) {
  const year = selectedDate.getFullYear();
  const month = selectedDate.getMonth();
  const day = getDate(selectedDate);
  const createHabitLog = useMutation(api.habitLogs.createHabitLog);
  const updateHabitLog = useMutation(api.habitLogs.updateHabitLog);

  const IconComp = HABIT_ICONS.find(
    (icon) => icon.name === habit.selectedIcon
  )?.component;

  async function handleLogTimesHabits() {
    if (!habit.log) {
      const newLogId = await createHabitLog({
        habitId: habit._id,
        isComplete: habit.unitValue === 1,
        year,
        month,
        day,
        unitsCompleted: 1,
      });

      if (!newLogId) {
        throw new Error("Failed to create a new habit log.");
      }
    } else {
      const newUnitsCompleted = habit.log.unitsCompleted + 1;

      if (newUnitsCompleted <= habit.unitValue && !habit.log.isComplete) {
        await updateHabitLog({
          habitLogId: habit.log._id,
          unitsCompleted: newUnitsCompleted,
          isComplete: true,
        });
        Alert.alert(
          "Habit Completed",
          "Congratulations! You’ve completed this habit."
        );
      } else {
        await updateHabitLog({
          habitLogId: habit.log._id,
          unitsCompleted: newUnitsCompleted,
        });
      }
    }
  }

  async function handleLogProgressHabits() {
    router.push({
      pathname: "/habits/[habitId]/log-progress",
      params: {
        habitId: habit._id,
        date: selectedDate.toDateString(),
      },
    });
  }

  return (
    <View
      className={cn(
        "flex-row items-center gap-4 p-4",
        habit.log?.isComplete && "bg-card"
      )}
    >
      <Link
        href={{
          pathname: `/habits/[habitId]`,
          params: {
            habitId: habit._id,
          },
        }}
        asChild
      >
        <Pressable className={cn("flex-1")}>
          <View className="flex-row items-center gap-4">
            <View
              className={cn(
                `size-14 items-center justify-center rounded-full`,
                {
                  "bg-[#2AA8CF]/20": habit.selectedIconColor === "#2AA8CF",
                  "bg-[#2A67F5]/20": habit.selectedIconColor === "#2A67F5",
                  "bg-[#299240]/20": habit.selectedIconColor === "#299240",
                  "bg-[#E1861D]/20": habit.selectedIconColor === "#E1861D",
                  "bg-[#D42C2C]/20": habit.selectedIconColor === "#D42C2C",
                  "bg-[#982ABF]/20": habit.selectedIconColor === "#982ABF",
                }
              )}
            >
              {IconComp ? (
                <IconComp
                  name={habit.selectedIcon}
                  color={habit.selectedIconColor}
                  size={20}
                />
              ) : null}
            </View>

            <View className="w-full gap-2">
              <Text
                className={cn(
                  "font-medium",
                  habit.log?.isComplete && "line-through"
                )}
              >
                {habit.name}
              </Text>
              <Text className="text-xs text-muted-foreground">
                {habit.log
                  ? `${Number.isInteger(habit.log.unitsCompleted) ? habit.log.unitsCompleted : habit.log.unitsCompleted.toFixed(1)} / ${Number.isInteger(habit.unitValue) ? habit.unitValue : habit.unitValue.toFixed(1)} ${habit.unit}`
                  : `0 / ${Number.isInteger(habit.unitValue) ? habit.unitValue : habit.unitValue.toFixed(1)} ${habit.unit}`}
              </Text>
            </View>
          </View>
        </Pressable>
      </Link>
      {habit.log?.isComplete ? (
        <CheckIcon className="color-input" size={32} />
      ) : habit.unit === "times" ? (
        <Button
          className="flex-row items-center gap-2 bg-input"
          onPress={handleLogTimesHabits}
        >
          <Text className="text-white">Log</Text>
          <MaterialCommunityIcons
            name="check-circle-outline"
            size={20}
            color="white"
          />
        </Button>
      ) : habit.unit === "hours" || habit.unit === "minutes" ? (
        <Button
          className="flex-row items-center gap-2 bg-input"
          onPress={handleLogProgressHabits}
        >
          <Text className="text-white">Log</Text>
          <MaterialCommunityIcons name="alarm" size={20} color="white" />
        </Button>
      ) : (
        <Button
          className="flex-row items-center gap-2 bg-input"
          onPress={handleLogProgressHabits}
        >
          <Text className="text-white">Log</Text>
          <MaterialCommunityIcons name="keyboard" size={16} color="white" />
        </Button>
      )}
    </View>
  );
}

function CalendarStrip() {
  const { date } = useLocalSearchParams<{ date?: string }>();
  const today = new Date();
  const tomorrow = addDays(today, 1);
  const [selectedDate, setSelectedDate] = useState(
    date ? new Date(Number(date)) : today
  );
  const scrollViewRef = useRef<ScrollView>(null);
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
          onPress={() => {
            setSelectedDate(date);
            router.setParams({ date: date.getTime() });
          }}
        >
          <Text
            className={cn("text-sm font-bold uppercase", {
              "text-[#fff]/50":
                date.toDateString() !== selectedDate.toDateString(),
            })}
          >
            {date.toLocaleDateString("en-US", { weekday: "short" })}
          </Text>
          <View className="w-14 items-center justify-center">
            <Text
              className={cn("text-sm font-bold", {
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

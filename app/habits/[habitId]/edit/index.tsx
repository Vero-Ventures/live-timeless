import { Stack, Link, router, useLocalSearchParams } from "expo-router";
import { AlertCircle, type LucideIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, View, Alert as NativeAlert } from "react-native";
import FormSubmitButton from "~/components/form-submit-button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";

// import { Repeat } from "~/lib/icons/Repeat";
import { Crosshair } from "~/lib/icons/Crosshair";
// import { Sun } from "~/lib/icons/Sun";
// import { Bell } from "~/lib/icons/Bell";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import ScheduleStartDate from "~/components/habits/schedule-start-date";
import {
  type DailyRepeat,
  type Recurrence,
  type RepeatType,
  type TimeOfDay,
  type UnitType,
  useHabitFormStore,
} from "~/stores/habit-store";
// import { formatTime } from "~/lib/date";
// import { addOrdinalSuffix } from "~/lib/add-ordinal-suffix";
import { cn } from "~/lib/utils";
import { useShallow } from "zustand/react/shallow";
import { api } from "~/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { HABIT_ICONS } from "~/constants/habit-icons";
import type { Id } from "~/convex/_generated/dataModel";
import { Button } from "~/components/ui/button";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function EditHabitPage() {
  return (
    <View className="h-full gap-4 bg-background p-4">
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff",
          headerTitle: () => <Text className="font-bold">Edit Habit</Text>,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <EditHabitForm />
    </View>
  );
}

function EditHabitForm() {
  const [
    name,
    setName,
    timeOfDay,
    setTimeOfDay,
    timeReminder,
    setTimeReminder,
    repeatType,
    setRepeatType,
    dailyRepeat,
    setDailyRepeat,
    monthlyRepeat,
    setMonthlyRepeat,
    intervalRepeat,
    setIntervalRepeat,
    selectedIcon,
    setSelectedIcon,
    selectedIconColor,
    setSelectedIconColor,
    startDate,
    setStartDate,
    unitType,
    setUnitType,
    unitValue,
    setUnitValue,
    unit,
    setUnit,
    recurrence,
    setRecurrence,
    resetForm,
  ] = useHabitFormStore(
    useShallow((s) => [
      s.name,
      s.setName,
      s.timeOfDay,
      s.setTimeOfDay,
      s.timeReminder,
      s.setTimeReminder,
      s.repeatType,
      s.setRepeatType,
      s.dailyRepeat,
      s.setDailyRepeat,
      s.monthlyRepeat,
      s.setMonthlyRepeat,
      s.intervalRepeat,
      s.setIntervalRepeat,
      s.selectedIcon,
      s.setSelectedIcon,
      s.selectedIconColor,
      s.setSelectedIconColor,
      s.startDate,
      s.setStartDate,
      s.unitType,
      s.setUnitType,
      s.unitValue,
      s.setUnitValue,
      s.unit,
      s.setUnit,
      s.recurrence,
      s.setRecurrence,
      s.resetForm,
    ])
  );

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const { habitId } = useLocalSearchParams<{ habitId: Id<"habits"> }>();
  const habit = useQuery(api.habits.getHabitById, { habitId });
  const updateHabit = useMutation(api.habits.updateHabit);
  const deleteHabit = useMutation(api.habits.deleteHabit);

  const handleDelete = () => {
    NativeAlert.alert(
      `Are you sure you want to delete ${habit?.name}?`,
      "This action cannot be undone.",
      [
        {
          text: "Yes",
          onPress: async () => {
            await deleteHabit({ habitId });
            router.dismissTo("/habits");
          },
          style: "destructive",
        },
        { text: "Cancel", style: "cancel" },
      ]
    );
  };

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setTimeOfDay(habit.timeOfDay as TimeOfDay[]);
      setTimeReminder(new Date(habit.timeReminder));
      setRepeatType(habit.repeatType as RepeatType);
      setDailyRepeat(habit.dailyRepeat as DailyRepeat[]);
      setMonthlyRepeat(habit.monthlyRepeat);
      setIntervalRepeat(habit.intervalRepeat);
      setSelectedIcon(habit.selectedIcon);
      setSelectedIconColor(habit.selectedIconColor);
      setStartDate(new Date(habit.startDate));
      setUnitType(habit.unitType as UnitType);
      setUnitValue(habit.unitValue);
      setUnit(habit.unit);
      setRecurrence(habit.recurrence as Recurrence);
    }

    return () => resetForm();
  }, [
    habit,
    setName,
    setTimeOfDay,
    setTimeReminder,
    setRepeatType,
    setDailyRepeat,
    setMonthlyRepeat,
    setIntervalRepeat,
    setSelectedIcon,
    setSelectedIconColor,
    setStartDate,
    setUnitType,
    setUnitValue,
    setUnit,
    setRecurrence,
    resetForm,
  ]);

  // const getRepeatValue = () => {
  //   switch (repeatType) {
  //     case "daily":
  //       return dailyRepeat.length === 7
  //         ? "Everyday"
  //         : dailyRepeat.map((day) => day.slice(0, 3)).join(", ");
  //     case "monthly":
  //       return `Every month on ${monthlyRepeat.map(addOrdinalSuffix).join(", ")}`;
  //     case "interval":
  //       return `Every ${intervalRepeat} days`;
  //     default:
  //       return "Not set";
  //   }
  // };

  const IconComp = HABIT_ICONS.find(
    (item) => item.name === selectedIcon
  )?.component;

  return (
    <KeyboardAwareScrollView>
      <View className="gap-4">
        {!!error && (
          <Alert icon={AlertCircle} variant="destructive" className="max-w-xl">
            <AlertTitle>Something went wrong!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <View className="flex flex-row items-center gap-2">
          <Link href="/habits/create/icon" asChild>
            <Pressable className="rounded-xl bg-[#0e2942] p-4 px-6">
              <IconComp
                name={selectedIcon}
                size={32}
                color={selectedIconColor}
              />
            </Pressable>
          </Link>
          <Input
            className="native:h-16 flex-1 rounded-xl border-0 bg-[#0e2942]"
            placeholder="Name of Habit"
            value={name}
            onChangeText={setName}
          />
        </View>
        <View className="rounded-xl bg-[#0e2942]">
          {/* <Link href="/habits/create/repeat" asChild>
            <Pressable>
              <ScheduleItem
                Icon={Repeat}
                iconBgColor="bg-[#2A67F5]"
                title="REPEAT"
                value={getRepeatValue()}
              />
            </Pressable>
          </Link> */}
          <Link href="/habits/create/target" asChild>
            <Pressable>
              <ScheduleItem
                Icon={Crosshair}
                iconBgColor="bg-[#0EAF0A]"
                title="TARGET"
                value={`${unitValue} ${unit} ${recurrence}`}
              />
            </Pressable>
          </Link>
          {/* <Link href="/habits/create/time-of-day" asChild>
            <Pressable>
              <ScheduleItem
                Icon={Sun}
                iconBgColor="bg-[#F0A122]"
                title="TIME OF DAY"
                value={
                  timeOfDay.length === 3 ? "Any Time" : timeOfDay.join(" and ")
                }
              />
            </Pressable>
          </Link> */}
        </View>
        {/* <View className="rounded-xl bg-[#0e2942]">
          <Link href="/habits/create/reminders" asChild>
            <Pressable>
              <ScheduleItem
                Icon={Bell}
                iconBgColor="bg-[#9037D1]"
                title="REMINDERS"
                value={formatTime(timeReminder)}
              />
            </Pressable>
          </Link>
        </View> */}

        <ScheduleStartDate />

        <FormSubmitButton
          size="lg"
          isPending={isPending}
          onPress={async () => {
            setError("");
            setIsPending(true);
            try {
              if (name.trim().length <= 3) {
                throw new Error("Name of the habit must be over 3 characters");
              }
              const updatedHabit = {
                habitId,
                name,
                selectedIcon,
                selectedIconColor,
                timeOfDay,
                timeReminderString: timeReminder.toDateString(),
                repeatType,
                dailyRepeat,
                monthlyRepeat,
                intervalRepeat,
                startDateString: startDate.toDateString(),
                unitType,
                unitValue,
                unit,
                recurrence,
              };

              await updateHabit(updatedHabit);

              router.dismissTo("/habits");
              resetForm();
            } catch (error) {
              if (error instanceof Error) {
                setError(error.message);
              }
            } finally {
              setIsPending(false);
            }
          }}
        >
          Save
        </FormSubmitButton>
        <Button size="lg" variant="destructive" onPress={handleDelete}>
          <Text>Delete</Text>
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
}

function ScheduleItem({
  Icon,
  iconBgColor,
  title,
  value,
}: {
  Icon: LucideIcon;
  iconBgColor: string;
  title: string;
  value: string;
}) {
  return (
    <View className="flex flex-row items-center gap-4 p-5">
      <View className={cn("rounded-xl p-2", iconBgColor)}>
        <Icon color="#fff" />
      </View>
      <View className="flex flex-1 flex-row items-center justify-between">
        <View>
          <Text className="text-xs font-semibold tracking-wider text-muted-foreground">
            {title}
          </Text>
          <Text className="font-semibold">{value}</Text>
        </View>
        <ChevronRight className="text-primary" />
      </View>
    </View>
  );
}

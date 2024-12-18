import { Stack, Link, router } from "expo-router";
import { AlertCircle, type LucideIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
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
import { useHabitFormStore } from "~/stores/habit-store";
// import { formatTime } from "~/lib/date";
// import { addOrdinalSuffix } from "~/lib/add-ordinal-suffix";
import { cn } from "~/lib/utils";
import { useShallow } from "zustand/react/shallow";
import { api } from "~/convex/_generated/api";
import { useMutation } from "convex/react";
import { HABIT_ICONS } from "~/constants/habit-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function CreateHabitPage() {
  return (
    <View className="h-full gap-4 bg-background p-4">
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff",
          headerTitle: () => <Text className="font-bold">Create Habit</Text>,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <CreateHabitForm />
    </View>
  );
}

function CreateHabitForm() {
  const [
    name,
    setName,
    timeOfDay,
    timeReminder,
    repeatType,
    dailyRepeat,
    monthlyRepeat,
    intervalRepeat,
    selectedIcon,
    selectedIconColor,
    startDate,
    unitType,
    unitValue,
    unit,
    recurrence,
    resetForm,
  ] = useHabitFormStore(
    useShallow((s) => [
      s.name,
      s.setName,
      s.timeOfDay,
      s.timeReminder,
      s.repeatType,
      s.dailyRepeat,
      s.monthlyRepeat,
      s.intervalRepeat,
      s.selectedIcon,
      s.selectedIconColor,
      s.startDate,
      s.unitType,
      s.unitValue,
      s.unit,
      s.recurrence,
      s.resetForm,
    ])
  );

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const createHabit = useMutation(api.habits.createHabit);
  useEffect(() => {
    return () => resetForm();
  }, [resetForm]);

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

              if (!selectedIcon) {
                throw new Error("You haven't selected an icon for your habit.");
              }

              const newHabit = {
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
              const habitId = await createHabit(newHabit);
              if (!habitId) {
                throw new Error("Failed to create habit");
              }

              router.navigate("/habits");
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
    <>
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
    </>
  );
}

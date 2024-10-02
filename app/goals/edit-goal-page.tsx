import { Stack, Link, router, useLocalSearchParams } from "expo-router";
import { AlertCircle, type LucideIcon } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Pressable, View } from "react-native";
import FormSubmitButton from "~/components/form-submit-button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { fontFamily } from "~/lib/font";
import { Repeat } from "~/lib/icons/Repeat";
import { Crosshair } from "~/lib/icons/Crosshair";
import { Sun } from "~/lib/icons/Sun";
import { Bell } from "~/lib/icons/Bell";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import ScheduleStartDate from "./schedule-start-date";
import {
  type DailyRepeat,
  type Recurrence,
  type RepeatType,
  type TimeOfDay,
  useCreateGoalFormStore,
} from "./create/create-goal-store";
import { formatTime } from "~/lib/date";
import { addOrdinalSuffix } from "~/lib/add-ordinal-suffix";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { cn } from "~/lib/utils";
import { useShallow } from "zustand/react/shallow";
import { api } from "~/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { GOAL_ICONS } from "~/constants/goal-icons";
import type { Id } from "~/convex/_generated/dataModel";
import { Button } from "~/components/ui/button";

export default function EditGoalPage() {
  return (
    <View className="h-full gap-4 bg-background p-4">
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff",
          headerTitle: () => (
            <Text style={{ fontFamily: fontFamily.openSans.bold }}>
              Edit Goal
            </Text>
          ),
          headerBackTitleVisible: false,
        }}
      />
      <EditGoalForm />
    </View>
  );
}

function EditGoalForm() {
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
    unitValue,
    setUnitValue,
    unit,
    setUnit,
    recurrence,
    setRecurrence,
    resetForm,
  ] = useCreateGoalFormStore(
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
  const updateGoal = useMutation(api.goals.updateGoal);
  const { goalId } = useLocalSearchParams<{ goalId: Id<"goals"> }>();
  const goal = useQuery(api.goals.getGoalById, { goalId });
  const deleteGoal = useMutation(api.goals.deleteGoal);

  const handleDelete = async (goalId: Id<"goals">) => {
    try {
      await deleteGoal({ goalId });
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  useEffect(() => {
    if (goal) {
      setName(goal.name);
      setTimeOfDay(goal.timeOfDay as TimeOfDay[]);
      setTimeReminder(new Date(goal.timeReminder));
      setRepeatType(goal.repeatType as RepeatType);
      setDailyRepeat(goal.dailyRepeat as DailyRepeat[]);
      setMonthlyRepeat(goal.monthlyRepeat);
      setIntervalRepeat(goal.intervalRepeat);
      setSelectedIcon(goal.selectedIcon);
      setSelectedIconColor(goal.selectedIconColor);
      setUnitValue(goal.unitValue);
      setUnit(goal.unit);
      setRecurrence(goal.recurrence as Recurrence);
    }

    return () => resetForm();
  }, [
    goal,
    setName,
    setTimeOfDay,
    setTimeReminder,
    setRepeatType,
    setDailyRepeat,
    setMonthlyRepeat,
    setIntervalRepeat,
    setSelectedIcon,
    setSelectedIconColor,
    setUnitValue,
    setUnit,
    setRecurrence,
    resetForm,
  ]);

  const getRepeatValue = () => {
    switch (repeatType) {
      case "daily":
        return dailyRepeat.length === 7
          ? "Everyday"
          : dailyRepeat.map((day) => day.slice(0, 3)).join(", ");
      case "monthly":
        return `Every month on ${monthlyRepeat.map(addOrdinalSuffix).join(", ")}`;
      case "interval":
        return `Every ${intervalRepeat} days`;
      default:
        return "Not set";
    }
  };

  const IconComp = GOAL_ICONS.find(
    (item) => item.name === selectedIcon
  )?.component;

  return (
    <View className="gap-4">
      {!!error && (
        <Alert icon={AlertCircle} variant="destructive" className="max-w-xl">
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <View className="flex flex-row items-center gap-2">
        <Link href="/goals/create/icon" asChild>
          <Pressable className="rounded-xl bg-[#0e2942] p-4 px-6">
            {selectedIcon ? (
              <IconComp
                name={selectedIcon}
                size={32}
                color={selectedIconColor}
              />
            ) : (
              <FontAwesome6
                name="question"
                size={32}
                color={selectedIconColor}
              />
            )}
          </Pressable>
        </Link>
        <Input
          className="native:h-16 flex-1 rounded-xl border-0 bg-[#0e2942]"
          placeholder="Name of Goal"
          value={name}
          onChangeText={setName}
        />
      </View>
      <View className="rounded-xl bg-[#0e2942]">
        <Link href="/goals/create/repeat" asChild>
          <Pressable>
            <ScheduleItem
              Icon={Repeat}
              iconBgColor="bg-[#2A67F5]"
              title="REPEAT"
              value={getRepeatValue()}
            />
          </Pressable>
        </Link>
        <Link href="/goals/create/target" asChild>
          <Pressable>
            <ScheduleItem
              Icon={Crosshair}
              iconBgColor="bg-[#0EAF0A]"
              title="TARGET"
              value={`${unitValue} ${unit} ${recurrence}`}
            />
          </Pressable>
        </Link>
        <Link href="/goals/create/time-of-day" asChild>
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
        </Link>
      </View>
      <View className="rounded-xl bg-[#0e2942]">
        <Link href="/goals/create/reminders" asChild>
          <Pressable>
            <ScheduleItem
              Icon={Bell}
              iconBgColor="bg-[#9037D1]"
              title="REMINDERS"
              value={formatTime(timeReminder)}
            />
          </Pressable>
        </Link>
      </View>

      <ScheduleStartDate />

      <FormSubmitButton
        size="lg"
        isPending={isPending}
        onPress={async () => {
          setError("");
          setIsPending(true);
          try {
            if (name.trim().length <= 3) {
              throw new Error("Name of the goal must be over 3 characters");
            }

            if (!selectedIcon) {
              throw new Error("You haven't selected an icon for your goal.");
            }

            const updatedGoal = {
              goalId,
              name,
              selectedIcon,
              selectedIconColor,
              timeOfDay,
              timeReminder: timeReminder.getTime(), // store as timestamp
              repeatType,
              dailyRepeat,
              monthlyRepeat,
              intervalRepeat,
              unitValue,
              unit,
              recurrence,
            };

            await updateGoal(updatedGoal);

            router.navigate("/goals");
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
        Edit Goal
      </FormSubmitButton>
      <Button
        size="lg"
        variant="destructive"
        onPress={async () => {
          await handleDelete(goalId);
          router.navigate("/goals");
        }}
      >
        <Text>Delete</Text>
      </Button>
    </View>
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
            <Text
              className="text-xs text-muted-foreground"
              style={{
                fontFamily: fontFamily.openSans.semiBold,
                letterSpacing: 0.5,
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.openSans.semiBold,
              }}
            >
              {value}
            </Text>
          </View>
          <ChevronRight className="text-primary" />
        </View>
      </View>
    </>
  );
}

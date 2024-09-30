// TODO: Make proper front-end for update goals, this is a placeholder

import { Stack, useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, Pressable, StyleSheet } from "react-native";
import { type LucideIcon } from "lucide-react-native";
import FormSubmitButton from "~/components/form-submit-button";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { useCreateGoalFormStore } from "./create/create-goal-store";
import { api } from "~/convex/_generated/api";
import { useMutation } from "convex/react";
import { Id } from "~/convex/_generated/dataModel";
import { Repeat } from "~/lib/icons/Repeat";
import { Crosshair } from "~/lib/icons/Crosshair";
import { Sun } from "~/lib/icons/Sun";
import { Bell } from "~/lib/icons/Bell";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Fa6Icons from "@expo/vector-icons/FontAwesome6";
import { formatTime } from "~/lib/date";
import { addOrdinalSuffix } from "~/lib/add-ordinal-suffix";
import { useShallow } from "zustand/react/shallow";
import ScheduleStartDate from "./schedule-start-date";

export default function UpdateGoalPage() {
  const router = useRouter();
  const { goalId: goalIdParam } = useLocalSearchParams();
  const goalId = goalIdParam as Id<"goals">;

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
    useShallow((state) => [
      state.name,
      state.setName,
      state.timeOfDay,
      state.setTimeOfDay,
      state.timeReminder,
      state.setTimeReminder,
      state.repeatType,
      state.setRepeatType,
      state.dailyRepeat,
      state.setDailyRepeat,
      state.monthlyRepeat,
      state.setMonthlyRepeat,
      state.intervalRepeat,
      state.setIntervalRepeat,
      state.selectedIcon,
      state.setSelectedIcon,
      state.selectedIconColor,
      state.setSelectedIconColor,
      state.unitValue,
      state.setUnitValue,
      state.unit,
      state.setUnit,
      state.recurrence,
      state.setRecurrence,
      state.resetForm,
    ])
  );

  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateGoal = useMutation(api.goals.updateGoal); // Use the updateGoal mutation

  const handleSubmit = async () => {
    setError(null);
    setIsPending(true);

    try {
      if (name.trim().length <= 3) {
        throw new Error("Goal name must be at least 3 characters long.");
      }

      const updatedGoal = {
        goalId,
        name,
        timeOfDay,
        selectedIcon:
          selectedIcon ??
          ("meditation" as keyof typeof MaterialCommunityIcons.glyphMap),
        selectedIconColor,
        repeatType,
        dailyRepeat,
        monthlyRepeat,
        intervalRepeat,
        timeReminder: timeReminder.toString(), // Convert Date to string
        createdAt: Date.now(), // You could keep the original createdAt if needed
      };

      console.log("Updating Goal:", updatedGoal);

      await updateGoal(updatedGoal);
      resetForm();
      router.push("/goals");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsPending(false);
    }
  };

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

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: "Update Goal" }} />

      {!!error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.row}>
        <Pressable onPress={() => router.push("/goals/create/icon")}>
          {selectedIcon ? (
            <MaterialCommunityIcons
              name={selectedIcon}
              size={32}
              color={selectedIconColor}
            />
          ) : (
            <Fa6Icons name="question" size={32} color={selectedIconColor} />
          )}
        </Pressable>
        <Input placeholder="Goal Name" value={name} onChangeText={setName} />
      </View>

      <View style={styles.roundedContainer}>
        <Pressable onPress={() => router.push("/goals/create/repeat")}>
          <ScheduleItem
            Icon={Repeat}
            iconBgColor="#2A67F5"
            title="REPEAT"
            value={getRepeatValue()}
          />
        </Pressable>

        <Pressable onPress={() => router.push("/goals/create/target")}>
          <ScheduleItem
            Icon={Crosshair}
            iconBgColor="#0EAF0A"
            title="TARGET"
            value={`${unitValue} ${unit} ${recurrence}`}
          />
        </Pressable>

        <Pressable onPress={() => router.push("/goals/create/time-of-day")}>
          <ScheduleItem
            Icon={Sun}
            iconBgColor="#F0A122"
            title="TIME OF DAY"
            value={
              timeOfDay.length === 3 ? "Any Time" : timeOfDay.join(" and ")
            }
          />
        </Pressable>
      </View>

      <View style={styles.roundedContainer}>
        <Pressable onPress={() => router.push("/goals/create/reminders")}>
          <ScheduleItem
            Icon={Bell}
            iconBgColor="#9037D1"
            title="REMINDERS"
            value={formatTime(timeReminder)}
          />
        </Pressable>
      </View>

      <ScheduleStartDate />

      <FormSubmitButton onPress={handleSubmit} isPending={isPending}>
        <Text>Update Goal</Text>
      </FormSubmitButton>
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
    <View style={styles.scheduleItem}>
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        <Icon color="#fff" />
      </View>
      <View style={styles.scheduleTextContainer}>
        <Text style={styles.scheduleTitle}>{title}</Text>
        <Text>{value}</Text>
      </View>
      <ChevronRight color="#fff" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  roundedContainer: {
    backgroundColor: "#0e2942",
    borderRadius: 12,
    padding: 10,
    marginTop: 10,
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
  scheduleItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
  },
  iconContainer: {
    padding: 10,
    borderRadius: 12,
  },
  scheduleTextContainer: {
    flex: 1,
  },
  scheduleTitle: {
    fontSize: 12,
    color: "#bbb",
  },
});

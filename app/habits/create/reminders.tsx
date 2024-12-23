import { type LucideIcon } from "lucide-react-native";

import { Stack } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { X } from "~/lib/icons/X";
import { Clock } from "~/lib/icons/Clock";
import { Plus } from "~/lib/icons/Plus";
import DateTimePicker from "react-native-modal-datetime-picker";
import { useHabitFormStore } from "~/stores/habit-store";
import { formatTime } from "~/lib/date";
import { useShallow } from "zustand/react/shallow";

export default function Reminders() {
  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff",
          headerTitle: () => <Text className="font-bold">Reminders</Text>,
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <View className="h-full bg-[#082139] p-4">
        <View className="gap-3">
          <Text className="ml-2 text-sm font-semibold text-muted-foreground">
            TIME
          </Text>
          <View className="rounded-xl bg-[#0e2942]">
            <TimeItem Icon={Clock} />
            <AddItem Icon={Plus} label="Add" />
          </View>
        </View>
      </View>
    </>
  );
}

function TimeItem({ Icon }: { Icon: LucideIcon }) {
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [timeReminder, setTimeReminder] = useHabitFormStore(
    useShallow((s) => [s.timeReminder, s.setTimeReminder])
  );

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setTimeReminder(date);
    hideTimePicker();
  };

  return (
    <View className="flex flex-row items-center gap-3 p-5">
      <Pressable
        className="flex flex-1 flex-row items-center gap-4"
        onPress={showTimePicker}
      >
        <Icon />
        <Text className="font-semibold">{formatTime(timeReminder)}</Text>
        <DateTimePicker
          isVisible={isTimePickerVisible}
          mode="time"
          date={timeReminder}
          onConfirm={handleConfirm}
          onCancel={hideTimePicker}
        />
      </Pressable>

      <X className="ml-auto font-bold text-primary" size={20} />
    </View>
  );
}

function AddItem({ Icon, label }: { Icon: LucideIcon; label: string }) {
  return (
    <>
      <View className="flex flex-row items-center gap-4 p-5">
        <Icon />
        <Text className="font-semibold text-primary">{label}</Text>
      </View>
    </>
  );
}

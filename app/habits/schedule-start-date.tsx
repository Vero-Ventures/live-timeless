import DateTimePicker from "react-native-modal-datetime-picker";

import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { CalendarDays } from "~/lib/icons/CalendarDays";
import { fontFamily } from "~/lib/font";
import { getRelativeDateLabel } from "~/lib/date";
import { useHabitFormStore } from "./create/habit-store";
import { useShallow } from "zustand/react/shallow";

export default function ScheduleStartDate() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [startDate, setStartDate] = useHabitFormStore(
    useShallow((s) => [s.startDate, s.setStartDate])
  );

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    setStartDate(date);
    hideDatePicker();
  };

  return (
    <Pressable onPress={showDatePicker}>
      <View className="rounded-xl bg-[#0e2942]">
        <View className="flex flex-row items-center gap-4 p-5">
          <View className="rounded-xl bg-[#1E00FE] p-2">
            <CalendarDays color="#fff" />
          </View>
          <View>
            <Text
              className="text-xs text-muted-foreground"
              style={{
                fontFamily: fontFamily.openSans.semiBold,
                letterSpacing: 0.5,
              }}
            >
              START DATE
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.openSans.semiBold,
              }}
            >
              {getRelativeDateLabel(startDate)}
            </Text>
          </View>
        </View>
        <DateTimePicker
          display="inline"
          isVisible={isDatePickerVisible}
          mode="date"
          date={startDate}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
    </Pressable>
  );
}

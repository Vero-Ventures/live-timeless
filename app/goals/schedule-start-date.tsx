import DateTimePicker from "react-native-modal-datetime-picker";

import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { Text } from "../../components/ui/text";
import { CalendarDays } from "~/lib/icons/CalendarDays";
import { fontFamily } from "~/lib/font";

export default function ScheduleStartDate() {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
  };

  return (
    <Pressable onPress={showDatePicker}>
      <View className="rounded-xl bg-muted">
        <View className="flex flex-row items-center gap-4 p-5">
          <CalendarDays className="text-primary" />
          <View>
            <Text
              className="text-xs"
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
              Today
            </Text>
          </View>
        </View>
        <DateTimePicker
          display="inline"
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </View>
    </Pressable>
  );
}

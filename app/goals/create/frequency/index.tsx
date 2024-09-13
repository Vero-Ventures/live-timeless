import { Picker } from "@react-native-picker/picker";

import { Link, Stack } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { fontFamily } from "~/lib/font";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { StyleSheet } from "react-native";

import { cn } from "~/lib/utils";

export default function Frequency() {
  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff",
          headerTitle: () => (
            <Text style={{ fontFamily: fontFamily.openSans.bold }}>
              Frequency
            </Text>
          ),
          headerBackTitleVisible: false,
        }}
      />
      <View className="h-full bg-[#082139] p-4">
        <UnitPicker />
        <SelectUnitType />
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  picker: {
    width: "30%",
    overflow: "hidden",
  },
  pickerItem: {
    fontSize: 14,
    fontFamily: fontFamily.openSans.medium,
    color: "#ffffff",
  },
});
function UnitPicker() {
  const [number, setNumber] = useState("20");
  const [unit, setUnit] = useState("min");
  const [frequency, setFrequency] = useState("per day");

  return (
    <View className="relative flex-row overflow-hidden rounded-xl bg-[#0e2942] p-2">
      <Picker
        selectedValue={number}
        style={styles.picker}
        itemStyle={{ ...styles.pickerItem }}
        onValueChange={(itemValue) => setNumber(itemValue)}
      >
        {[...Array(60).keys()].map((num) => (
          <Picker.Item
            key={num + 1}
            label={(num + 1).toString()}
            value={(num + 1).toString()}
          />
        ))}
      </Picker>
      <Picker
        selectedValue={unit}
        style={styles.picker}
        itemStyle={styles.pickerItem}
        onValueChange={(itemValue) => setUnit(itemValue)}
      >
        <Picker.Item label="min" value="min" />
        <Picker.Item label="hours" value="hours" />
      </Picker>
      <Picker
        selectedValue={frequency}
        style={{
          ...styles.picker,
          width: "40%",
        }}
        itemStyle={styles.pickerItem}
        onValueChange={(itemValue: string) => setFrequency(itemValue)}
      >
        <Picker.Item label="per day" value="per day" />
        <Picker.Item label="per week" value="per week" />
        <Picker.Item label="per month" value="per month" />
      </Picker>
    </View>
  );
}

function SelectUnitType() {
  return (
    <Link href="/goals/create/frequency/unit-type" asChild>
      <Pressable className="mt-4 flex flex-row items-center justify-between rounded-xl bg-[#0e2942] p-5">
        <Text
          style={{
            fontFamily: fontFamily.openSans.semiBold,
          }}
        >
          Unit Type
        </Text>
        <View className="flex flex-row items-center justify-center gap-1">
          <Text className="text-muted-foreground">Duration</Text>
          <ChevronRight />
        </View>
      </Pressable>
    </Link>
  );
}

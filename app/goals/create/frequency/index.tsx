import { Picker } from "@react-native-picker/picker";

import { Link, Stack } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { fontFamily } from "~/lib/font";
import { ChevronRight } from "~/lib/icons/ChevronRight";

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

function UnitPicker() {
  const [number, setNumber] = useState("1");
  const [unit, setUnit] = useState("hour");
  const [frequency, setFrequency] = useState("per day");

  return (
    <View className="flex flex-row">
      <Picker
        selectedValue={number}
        style={{
          flex: 1,
        }}
        onValueChange={(itemValue) => setNumber(itemValue)}
      >
        {[1, 2, 3, 4, 5].map((num) => (
          <Picker.Item
            key={num}
            label={num.toString()}
            value={num.toString()}
            color="#fafafa"
          />
        ))}
      </Picker>

      <Picker
        selectedValue={unit}
        style={{ flex: 1 }}
        onValueChange={(itemValue) => setUnit(itemValue)}
      >
        <Picker.Item label="hour" value="hour" color="#fafafa" />
        <Picker.Item label="day" value="day" color="#fafafa" />
        <Picker.Item label="week" value="week" color="#fafafa" />
      </Picker>

      <Picker
        selectedValue={frequency}
        style={{ flex: 1 }}
        onValueChange={(itemValue) => setFrequency(itemValue)}
      >
        <Picker.Item label="per day" value="per day" color="#fafafa" />
        <Picker.Item label="per week" value="per week" color="#fafafa" />
        <Picker.Item label="per month" value="per month" color="#fafafa" />
      </Picker>
    </View>
  );
}

function SelectUnitType() {
  return (
    <Link href="/goals/create/frequency/unit-type" asChild>
      <Pressable className="flex flex-row items-center justify-between rounded-xl bg-[#0e2942] p-5">
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

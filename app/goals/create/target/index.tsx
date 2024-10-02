import { Picker } from "@react-native-picker/picker";

import { Link, Stack } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { fontFamily } from "~/lib/font";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { useCreateGoalFormStore } from "../create-goal-store";
import type { UnitType } from "../create-goal-store";
import { StyleSheet } from "react-native";
import { RECURRENCE } from "./constants";
import { useShallow } from "zustand/react/shallow";
import { useMemo } from "react";
export default function Frequency() {
  const unitType = useCreateGoalFormStore((s) => s.unitType);

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
        {unitType === "General" ? (
          <GoalPicker
            units={["times", "minutes"]}
            ranges={{
              times: {
                min: 1,
                max: 1000,
                step: 1,
              },
              minutes: {
                min: 1,
                max: 1200,
                step: 1,
              },
            }}
          />
        ) : unitType === "Scalar" ? (
          <GoalPicker
            units={["times", "steps"]}
            ranges={{
              times: {
                min: 1,
                max: 1000,
                step: 1,
              },
              steps: {
                min: 1000,
                max: 9900,
                step: 1000,
              },
            }}
          />
        ) : unitType === "Mass" ? (
          <GoalPicker
            units={["kg", "grams", "mg", "oz", "pounds", "µg"]}
            ranges={{
              kg: {
                min: 1,
                max: 1000,
                step: 1,
              },
              grams: {
                min: 5,
                max: 4995,
                step: 5,
              },
              mg: {
                min: 1,
                max: 10000,
                step: 1,
              },
              oz: {
                min: 1,
                max: 1000,
                step: 1,
              },
              pounds: {
                min: 1,
                max: 1000,
                step: 1,
              },
              µg: {
                min: 5,
                max: 4995,
                step: 5,
              },
            }}
          />
        ) : unitType === "Volume" ? (
          <GoalPicker
            units={["litres", "mL", "US fl oz", "cups"]}
            ranges={{
              litres: {
                min: 1,
                max: 1000,
                step: 1,
              },
              mL: {
                min: 100,
                max: 29900,
                step: 100,
              },
              "US fl oz": {
                min: 5,
                max: 995,
                step: 5,
              },
              cups: {
                min: 1,
                max: 1000,
                step: 1,
              },
            }}
          />
        ) : unitType === "Duration" ? (
          <GoalPicker
            units={["min", "hours"]}
            ranges={{
              min: {
                min: 1,
                max: 1200,
                step: 1,
              },
              hours: {
                min: 1,
                max: 1000,
                step: 1,
              },
            }}
          />
        ) : unitType === "Energy" ? (
          <GoalPicker
            units={["kilojoules", "cal", "kcal", "joules"]}
            ranges={{
              joules: {
                min: 1000,
                max: 99000,
                step: 1000,
              },
              kilojoules: {
                min: 50,
                max: 41950,
                step: 50,
              },
              cal: {
                min: 500,
                max: 1999500,
                step: 500,
              },
              kcal: {
                min: 100,
                max: 9900,
                step: 100,
              },
            }}
          />
        ) : unitType === "Length" ? (
          <GoalPicker
            units={["km", "metres", "feet", "yards", "miles"]}
            ranges={{
              metres: {
                min: 10,
                max: 49990,
                step: 10,
              },
              km: {
                min: 1,
                max: 1000,
                step: 1,
              },
              miles: {
                min: 1,
                max: 1000,
                step: 1,
              },
              feet: {
                min: 100,
                max: 99900,
                step: 100,
              },
              yards: {
                min: 50,
                max: 49950,
                step: 50,
              },
            }}
          />
        ) : null}
        <SelectUnitType unitType={unitType} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  pickerItem: {
    fontSize: 14,
    fontFamily: fontFamily.openSans.semiBold,
    color: "#ffffff",
  },
});

function GoalPicker<TUnit extends string>({
  ranges,
  units,
}: {
  units: TUnit[];
  ranges: {
    [key in TUnit]: {
      min: number;
      max: number;
      step: number;
    };
  };
}) {
  const [unitValue, setUnitValue, unit, setUnit, recurrence, setRecurrence] =
    useCreateGoalFormStore(
      useShallow((s) => [
        s.unitValue,
        s.setUnitValue,
        s.unit as TUnit,
        s.setUnit,
        s.recurrence,
        s.setRecurrence,
      ])
    );

  const { minValue, maxValue, step } = useMemo(() => {
    return {
      minValue: ranges[unit].min,
      maxValue: ranges[unit].max,
      step: ranges[unit].step,
    };
  }, [unit, ranges]);

  const unitValueRange = useMemo(() => {
    return Array.from(
      { length: (maxValue - minValue) / step + 1 },
      (_, index) => minValue + index * step
    );
  }, [minValue, maxValue, step]);

  return (
    <View className="relative flex-row overflow-hidden rounded-xl bg-[#0e2942] p-2">
      <Picker
        selectedValue={unitValue}
        style={{ width: "26%" }}
        itemStyle={styles.pickerItem}
        onValueChange={(value) => {
          setUnitValue(+value);
        }}
      >
        {unitValueRange.map((value) => (
          <Picker.Item key={value} label={value.toString()} value={value} />
        ))}
      </Picker>
      <Picker
        selectedValue={unit}
        onValueChange={(itemValue) => {
          setUnit(itemValue);
          if (itemValue !== unit) {
            const newMin = ranges[itemValue].min;
            setUnitValue(newMin);
          }
        }}
        style={{
          width: "34%",
        }}
        itemStyle={styles.pickerItem}
      >
        {units.map((unit) => (
          <Picker.Item key={unit} label={unit} value={unit} />
        ))}
      </Picker>
      <Picker
        style={{
          width: "40%",
        }}
        itemStyle={styles.pickerItem}
        selectedValue={recurrence}
        onValueChange={(itemValue) => {
          setRecurrence(itemValue);
        }}
      >
        {RECURRENCE.map((item) => (
          <Picker.Item key={item} label={item} value={item} />
        ))}
      </Picker>
    </View>
  );
}

function SelectUnitType({ unitType }: { unitType: UnitType }) {
  return (
    <Link href="/goals/create/target/unit-types" asChild>
      <Pressable className="mt-4 flex flex-row items-center justify-between rounded-xl bg-[#0e2942] p-5">
        <Text
          style={{
            fontFamily: fontFamily.openSans.semiBold,
          }}
        >
          Unit Type
        </Text>
        <View className="flex flex-row items-center justify-center gap-1">
          <Text className="text-muted-foreground">{unitType}</Text>
          <ChevronRight />
        </View>
      </Pressable>
    </Link>
  );
}

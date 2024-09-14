import { Picker } from "@react-native-picker/picker";

import { Link, Stack } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { fontFamily } from "~/lib/font";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import { StyleSheet } from "react-native";
import { FREQUENCY } from "./constants";
import { useCreateGoalFormStore } from "../create-goal-store";
import type { Recurrence, Unit, UnitType } from "../create-goal-store";
import { arrayRange, capitalize } from "~/lib/utils";

export default function Frequency() {
  const { unitType } = useCreateGoalFormStore();

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
        <GoalPicker />
        <SelectUnitType unitType={unitType} />
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
    fontFamily: fontFamily.openSans.semiBold,
    color: "#ffffff",
  },
});
function GoalPicker() {
  const {
    unitType,
    unitValue,
    setUnitValue,
    unit,
    setUnit,
    recurrence,
    setRecurrence,
  } = useCreateGoalFormStore();

  switch (unitType) {
    case "general":
      const generalUnits = FREQUENCY.general.units;
      return (
        <Goal
          unitType="general"
          valueRange={arrayRange(
            generalUnits[unit].min,
            generalUnits[unit].max,
            generalUnits[unit].step
          )}
          unitRange={Object.keys(generalUnits)}
          recurrenceRange={FREQUENCY.general.recurrence}
          unitValue={unitValue}
          setUnitValue={setUnitValue}
          unit={unit}
          setUnit={setUnit}
          recurrence={recurrence}
          setRecurrence={setRecurrence}
        />
      );
    case "scalar":
      const scalarUnits = FREQUENCY.scalar.units;
      return (
        <Goal
          unitType="scalar"
          valueRange={arrayRange(
            scalarUnits[unit].min,
            scalarUnits[unit].max,
            scalarUnits[unit].step
          )}
          unitRange={Object.keys(scalarUnits)}
          recurrenceRange={FREQUENCY.scalar.recurrence}
          unitValue={unitValue}
          setUnitValue={setUnitValue}
          unit={unit}
          setUnit={setUnit}
          recurrence={recurrence}
          setRecurrence={setRecurrence}
        />
      );
    case "mass":
      const massUnits = FREQUENCY.mass.units;
      return (
        <Goal
          unitType="mass"
          valueRange={arrayRange(
            massUnits[unit].min,
            massUnits[unit].max,
            massUnits[unit].step
          )}
          unitRange={Object.keys(massUnits)}
          recurrenceRange={FREQUENCY.mass.recurrence}
          unitValue={unitValue}
          setUnitValue={setUnitValue}
          unit={unit}
          setUnit={setUnit}
          recurrence={recurrence}
          setRecurrence={setRecurrence}
        />
      );
    case "volume":
      const volumeUnits = FREQUENCY.volume.units;
      return (
        <Goal
          unitType="volume"
          valueRange={arrayRange(
            volumeUnits[unit].min,
            volumeUnits[unit].max,
            volumeUnits[unit].step
          )}
          unitRange={Object.keys(volumeUnits)}
          recurrenceRange={FREQUENCY.volume.recurrence}
          unitValue={unitValue}
          setUnitValue={setUnitValue}
          unit={unit}
          setUnit={setUnit}
          recurrence={recurrence}
          setRecurrence={setRecurrence}
        />
      );
    case "duration":
      const durationUnits = FREQUENCY.duration.units;
      return (
        <Goal
          unitType="duration"
          valueRange={arrayRange(
            durationUnits[unit].min,
            durationUnits[unit].max,
            durationUnits[unit].step
          )}
          unitRange={Object.keys(durationUnits)}
          recurrenceRange={FREQUENCY.duration.recurrence}
          unitValue={unitValue}
          setUnitValue={setUnitValue}
          unit={unit}
          setUnit={setUnit}
          recurrence={recurrence}
          setRecurrence={setRecurrence}
        />
      );
    case "energy":
      const energyUnits = FREQUENCY.energy.units;
      return (
        <Goal
          unitType="energy"
          valueRange={arrayRange(
            energyUnits[unit].min,
            energyUnits[unit].max,
            energyUnits[unit].step
          )}
          unitRange={Object.keys(energyUnits)}
          recurrenceRange={FREQUENCY.energy.recurrence}
          unitValue={unitValue}
          setUnitValue={setUnitValue}
          unit={unit}
          setUnit={setUnit}
          recurrence={recurrence}
          setRecurrence={setRecurrence}
        />
      );
    case "length":
      const lengthUnits = FREQUENCY.length.units;
      return (
        <Goal
          unitType="length"
          valueRange={arrayRange(
            lengthUnits[unit].min,
            lengthUnits[unit].max,
            lengthUnits[unit].step
          )}
          unitRange={Object.keys(lengthUnits)}
          recurrenceRange={FREQUENCY.length.recurrence}
          unitValue={unitValue}
          setUnitValue={setUnitValue}
          unit={unit}
          setUnit={setUnit}
          recurrence={recurrence}
          setRecurrence={setRecurrence}
        />
      );
    default:
      return;
  }
}

function Goal({
  unitType,
  valueRange,
  unitRange,
  recurrenceRange,
  unitValue,
  setUnitValue,
  unit,
  setUnit,
  recurrence,
  setRecurrence,
}: {
  unitType: UnitType;
  valueRange: number[];
  unitRange: string[];
  recurrenceRange: readonly string[];
  unitValue: number;
  setUnitValue: (unitValue: number) => void;
  unit: Unit;
  setUnit: (unit: Unit) => void;
  recurrence: Recurrence;
  setRecurrence: (recurrence: Recurrence) => void;
}) {
  return (
    <View className="relative flex-row overflow-hidden rounded-xl bg-[#0e2942] p-2">
      <Picker
        selectedValue={unitValue}
        style={styles.picker}
        itemStyle={{ ...styles.pickerItem }}
        onValueChange={(itemValue) => setUnitValue(itemValue)}
      >
        {valueRange.map((num) => (
          <Picker.Item
            key={num}
            label={num.toString()}
            value={num.toString()}
          />
        ))}
      </Picker>
      <Picker
        selectedValue={unit}
        style={styles.picker}
        itemStyle={styles.pickerItem}
        onValueChange={(itemValue) => {
          setUnit(itemValue);
          const firstUnitValue = FREQUENCY[unitType].units[itemValue].min;
          setUnitValue(firstUnitValue);
        }}
      >
        {unitRange.map((unit) => (
          <Picker.Item
            key={unit}
            label={unit.toString()}
            value={unit.toString()}
          />
        ))}
      </Picker>
      <Picker
        selectedValue={recurrence}
        style={{
          ...styles.picker,
          width: "40%",
        }}
        itemStyle={styles.pickerItem}
        onValueChange={(itemValue) => setRecurrence(itemValue)}
      >
        {recurrenceRange.map((item) => (
          <Picker.Item
            key={item}
            label={item.toString()}
            value={item.toString()}
          />
        ))}
      </Picker>
    </View>
  );
}

function SelectUnitType({ unitType }: { unitType: UnitType }) {
  return (
    <Link href="/goals/create/frequency/unit-types" asChild>
      <Pressable className="mt-4 flex flex-row items-center justify-between rounded-xl bg-[#0e2942] p-5">
        <Text
          style={{
            fontFamily: fontFamily.openSans.semiBold,
          }}
        >
          Unit Type
        </Text>
        <View className="flex flex-row items-center justify-center gap-1">
          <Text className="text-muted-foreground">{capitalize(unitType)}</Text>
          <ChevronRight />
        </View>
      </Pressable>
    </Link>
  );
}

// Type helper function
function getUnits(unitType: UnitType): Unit[] {
  const units = Object.keys(FREQUENCY[unitType].units) as Unit[];
  return units;
}

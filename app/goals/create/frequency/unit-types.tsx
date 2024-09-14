import { Link, Stack } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { fontFamily } from "~/lib/font";
import { cn } from "~/lib/utils";
import { useCreateGoalFormStore } from "../create-goal-store";
import type { Unit, UnitType } from "../create-goal-store";
import { FREQUENCY } from "./constants";

export default function UnitTypes() {
  const { setUnitType, setUnitValue, setUnit, setRecurrence } =
    useCreateGoalFormStore();

  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff",
          headerTitle: "",
          headerBackTitleVisible: false,
        }}
      />
      <View className="h-full bg-[#082139]">
        <GoalUnitType
          type="General"
          units={["times", "minutes"]}
          className="border-b border-[#9cc5ff13]"
          onPress={() => {
            setUnitType("general");
            const minimumValueOfFirstUnit = FREQUENCY.general.units.times.min;
            setUnitValue(minimumValueOfFirstUnit);
            setUnit(getFirstUnit("general"));
            setRecurrence(FREQUENCY.general.recurrence[0]);
          }}
        />
        <GoalUnitType
          type="Scalar"
          units={["times", "steps"]}
          className="border-b border-[#9cc5ff13]"
          onPress={() => {
            setUnitType("scalar");
            const minimumValueOfFirstUnit = FREQUENCY.scalar.units.times.min;
            setUnitValue(minimumValueOfFirstUnit);
            setUnit(getFirstUnit("scalar"));
            setRecurrence(FREQUENCY.scalar.recurrence[0]);
          }}
        />
        <GoalUnitType
          type="Mass"
          units={[
            "kilograms",
            "grams",
            "milligrams",
            "ounce",
            "pounds",
            "microgram",
          ]}
          className="border-b border-[#9cc5ff13]"
          onPress={() => {
            setUnitType("mass");
            const minimumValueOfFirstUnit = FREQUENCY.mass.units.kg.min;
            setUnitValue(minimumValueOfFirstUnit);
            setUnit(getFirstUnit("mass"));
            setRecurrence(FREQUENCY.mass.recurrence[0]);
          }}
        />
        <GoalUnitType
          type="Volume"
          units={["litres", "milliliters", "fluid ounce", "cups"]}
          className="border-b border-[#9cc5ff13]"
          onPress={() => {
            setUnitType("volume");
            const minimumValueOfFirstUnit = FREQUENCY.volume.units.litres.min;
            setUnitValue(minimumValueOfFirstUnit);
            setUnit(getFirstUnit("volume"));
            setRecurrence(FREQUENCY.volume.recurrence[0]);
          }}
        />
        <GoalUnitType
          type="Duration"
          units={["minutes", "hours"]}
          className="border-b border-[#9cc5ff13]"
          onPress={() => {
            setUnitType("duration");
            const minimumValueOfFirstUnit = FREQUENCY.duration.units.mins.min;
            setUnitValue(minimumValueOfFirstUnit);
            setUnit(getFirstUnit("duration"));
            setRecurrence(FREQUENCY.duration.recurrence[0]);
          }}
        />
        <GoalUnitType
          type="Energy"
          units={["joules", "kilojoules", "calories", "kilocalories"]}
          className="border-b border-[#9cc5ff13]"
          onPress={() => {
            setUnitType("energy");
            const minimumValueOfFirstUnit =
              FREQUENCY.energy.units.kilojoules.min;
            setUnitValue(minimumValueOfFirstUnit);
            setUnit(getFirstUnit("energy"));
            setRecurrence(FREQUENCY.energy.recurrence[0]);
          }}
        />
        <GoalUnitType
          type="Length"
          units={["metres", "kilometers", "miles", "feet", "yards"]}
          onPress={() => {
            setUnitType("length");
            const minimumValueOfFirstUnit = FREQUENCY.length.units.metres.min;
            setUnitValue(minimumValueOfFirstUnit);
            setUnit(getFirstUnit("length"));
            setRecurrence(FREQUENCY.length.recurrence[0]);
          }}
        />
      </View>
    </>
  );
}

function GoalUnitType({
  type,
  units,
  onPress,
  className,
}: {
  type: string;
  units: string[];
  onPress: () => void;
  className?: string;
}) {
  return (
    <Link href="/goals/create/frequency" asChild>
      <Pressable
        className={cn(
          "flex flex-row items-center justify-between bg-[#0e2942] p-4",
          className
        )}
        onPress={onPress}
      >
        <Text
          className="text-lg"
          style={{
            fontFamily: fontFamily.openSans.bold,
            letterSpacing: 0.5,
          }}
        >
          {type}
        </Text>
        <Text
          className="text-sm"
          numberOfLines={1}
          style={{
            fontFamily: fontFamily.openSans.semiBold,
            textAlign: "right",
            width: "40%",
          }}
        >
          {units.join(", ")}
        </Text>
      </Pressable>
    </Link>
  );
}

// Type helper function
function getFirstUnit(unitType: UnitType): Unit {
  const units = Object.keys(FREQUENCY[unitType].units) as Unit[];
  return units[0];
}

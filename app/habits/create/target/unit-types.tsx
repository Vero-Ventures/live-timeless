import { Stack, router } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { cn } from "~/lib/utils";
import { useHabitFormStore } from "~/stores/habit-store";
import { useShallow } from "zustand/react/shallow";
export default function UnitTypes() {
  const [setUnitType, setUnitValue, setUnit, setRecurrence] = useHabitFormStore(
    useShallow((s) => [
      s.setUnitType,
      s.setUnitValue,
      s.setUnit,
      s.setRecurrence,
    ])
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff",
          headerTitle: "",
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      <View className="h-full bg-[#082139]">
        <UnitType
          type="General"
          units={["times", "minutes"]}
          className="border-b border-[#9cc5ff13]"
          onPress={() => {
            setUnitType("General");
            setUnitValue(1);
            setUnit("times");
            setRecurrence("per day");
            router.back();
          }}
        />
        <UnitType
          type="Scalar"
          units={["times", "steps"]}
          className="border-b border-[#9cc5ff13]"
          onPress={() => {
            setUnitType("Scalar");
            setUnitValue(1);
            setUnit("times");
            setRecurrence("per day");
            router.back();
          }}
        />
        <UnitType
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
            setUnitType("Mass");
            setUnitValue(1);
            setUnit("kg");
            setRecurrence("per day");
            router.back();
          }}
        />
        <UnitType
          type="Volume"
          units={["litres", "milliliters", "fluid ounce", "cups"]}
          className="border-b border-[#9cc5ff13]"
          onPress={() => {
            setUnitType("Volume");
            setUnitValue(1);
            setUnit("litres");
            setRecurrence("per day");
            router.back();
          }}
        />
        <UnitType
          type="Duration"
          units={["minutes", "hours"]}
          className="border-b border-[#9cc5ff13]"
          onPress={() => {
            setUnitType("Duration");
            setUnitValue(1);
            setUnit("min");
            setRecurrence("per day");
            router.back();
          }}
        />
        <UnitType
          type="Energy"
          units={["joules", "kilojoules", "calories", "kilocalories"]}
          className="border-b border-[#9cc5ff13]"
          onPress={() => {
            setUnitType("Energy");
            setUnitValue(1000);
            setUnit("joules");
            setRecurrence("per day");
            router.back();
          }}
        />
        <UnitType
          type="Length"
          units={["metres", "kilometers", "miles", "feet", "yards"]}
          onPress={() => {
            setUnitType("Length");
            setUnitValue(10);
            setUnit("metres");
            setRecurrence("per day");
            router.back();
          }}
        />
      </View>
    </>
  );
}

function UnitType({
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
    <Pressable
      className={cn(
        "flex flex-row items-center justify-between bg-[#0e2942] p-4",
        className
      )}
      onPress={onPress}
    >
      <Text className="text-lg tracking-wider">{type}</Text>
      <Text
        className="w-[40%] text-right text-sm font-semibold"
        numberOfLines={1}
      >
        {units.join(", ")}
      </Text>
    </Pressable>
  );
}

import { Stack } from "expo-router";
import { Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { fontFamily } from "~/lib/font";
import { cn } from "~/lib/utils";

export default function UnitTypes() {
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
        <UnitType
          type="General"
          units={["times", "minutes"]}
          className="border-b border-[#9cc5ff13]"
        />
        <UnitType
          type="Scalar"
          units={["times", "steps"]}
          className="border-b border-[#9cc5ff13]"
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
        />
        <UnitType
          type="Volume"
          units={["litres", "milliliters", "fluid ounce", "cups"]}
          className="border-b border-[#9cc5ff13]"
        />
        <UnitType
          type="Duration"
          units={["minutes", "hours"]}
          className="border-b border-[#9cc5ff13]"
        />
        <UnitType
          type="Energy"
          units={["joules", "kilojoules", "calories", "kilocalories"]}
          className="border-b border-[#9cc5ff13]"
        />
        <UnitType
          type="Length"
          units={["metres", "kilometers", "miles", "feet", "yards"]}
        />
      </View>
    </>
  );
}

function UnitType({
  type,
  units,
  // onPress,
  className,
}: {
  type: string;
  units: string[];
  // onPress: () => void;
  className?: string;
}) {
  return (
    <Pressable
      className={cn(
        "flex flex-row items-center justify-between bg-[#0e2942] p-4",
        className
      )}
      // onPress={onPress}
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
  );
}

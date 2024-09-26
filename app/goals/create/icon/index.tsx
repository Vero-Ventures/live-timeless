// TODO: Add icon selection support for update goal form. Currently selecting an icon will always make new goal.
import { Link, Stack } from "expo-router";
import { Pressable, ScrollView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { fontFamily } from "~/lib/font";
import { Check } from "~/lib/icons/Check";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import {
  useCreateGoalFormStore, 
  type MaterialCommunityIcon,
} from "../create-goal-store";
import { cn } from "~/lib/utils";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useShallow } from "zustand/react/shallow";

export default function IconScreen() {
  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff",
          headerBackTitleVisible: false,
          header: () => (
            <View className="h-48 border-b border-b-[#fff]/10 bg-[#0b1a28] pt-20">
              <View className="relative flex flex-row items-center justify-center gap-2">
                <Link href="/goals/create" asChild>
                  <Pressable className="absolute left-0.5" hitSlop={20}>
                    <ChevronLeft color="#fff" size={35} />
                  </Pressable>
                </Link>
                <Text style={{ fontFamily: fontFamily.openSans.bold }}>
                  Icon
                </Text>
              </View>
              <View className="mt-6 flex-row justify-evenly px-4">
                <ColorPicker color="#2AA8CF" />
                <ColorPicker color="#2A67F5" />
                <ColorPicker color="#299240" />
                <ColorPicker color="#E1861D" />
                <ColorPicker color="#D42C2C" />
                <ColorPicker color="#982ABF" />
              </View>
            </View>
          ),
        }}
      />
      <ScrollView
        className="h-full bg-[#082139] p-4"
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >
        <View className="flex flex-row flex-wrap gap-4">
          <IconPickerList />
        </View>
      </ScrollView>
    </>
  );
}

function ColorPicker({ color }: { color: string }) {
  const [selectedIconColor, setSelectedIconColor] = useCreateGoalFormStore(
    useShallow((s) => [s.selectedIconColor, s.setSelectedIconColor])
  );
  const isSelected = selectedIconColor === color;

  return (
    <Pressable onPress={() => setSelectedIconColor(color)}>
      <View
        className={cn(
          "h-12 w-12 items-center justify-center rounded-full bg-transparent",
          {
            "border-2": isSelected,
            "border-[#2AA8CF]": selectedIconColor === "#2AA8CF",
            "border-[#2A67F5]": selectedIconColor === "#2A67F5",
            "border-[#299240]": selectedIconColor === "#299240",
            "border-[#E1861D]": selectedIconColor === "#E1861D",
            "border-[#D42C2C]": selectedIconColor === "#D42C2C",
            "border-[#982ABF]": selectedIconColor === "#982ABF",
          }
        )}
      >
        <View
          className={cn("h-10 w-10 rounded-full", {
            "bg-[#2AA8CF]": color === "#2AA8CF",
            "bg-[#2A67F5]": color === "#2A67F5",
            "bg-[#299240]": color === "#299240",
            "bg-[#E1861D]": color === "#E1861D",
            "bg-[#D42C2C]": color === "#D42C2C",
            "bg-[#982ABF]": color === "#982ABF",
          })}
        >
          {!!isSelected && <Check color="#fff" className="m-auto" />}
        </View>
      </View>
    </Pressable>
  );
}
function IconPicker({ icon }: { icon: MaterialCommunityIcon }) {
  const [selectedIcon, setSelectedIcon, selectedIconColor] =
    useCreateGoalFormStore(
      useShallow((s) => [
        s.selectedIcon,
        s.setSelectedIcon,
        s.selectedIconColor,
      ])
    );
  const isSelected = selectedIcon === icon;

  return (
    <Pressable onPress={() => setSelectedIcon(icon)}>
      <View
        className={cn(
          "items-center justify-center rounded-xl bg-[#0e2942] p-4",
          isSelected && `bg-[${selectedIconColor}]`
        )}
      >
        <MaterialCommunityIcons
          name={icon}
          size={32}
          color={isSelected ? "#fff" : "#4a7ba6"}
        />
      </View>
    </Pressable>
  );
}

export const GoalIconsList: MaterialCommunityIcon[] = [
  "smoking-off",
  "lipstick",
  "sofa",
  "shower",
  "swim",
  "run",
  "run-fast",
  "jump-rope",
  "meditation",
  "hands-pray",
  "bicycle",
  "bottle-tonic-plus",
  "pill",
  "clipboard",
  "cup-water",
  "paper-roll",
  "bandage",
  "toothbrush",
  "food",
  "food-variant",
  "food-fork-drink",
  "food-apple",
  "food-drumstick",
  "food-hot-dog",
  "food-takeout-box",
  "pine-tree",
  "flower",
  "flower-tulip",
  "format-list-checkbox",
  "star",
  "trophy",
  "trophy-variant",
  "trophy-award",
  "crown",
  "shopping",
  "cart",
  "book-education",
  "gamepad",
  "gamepad-variant",
  "car",
  "airplane",
  "bus",
  "alarm",
  "battery",
  "baby-bottle",
  "weather-night",
  "fire",
  "party-popper",
  "monitor",
  "cellphone",
  "phone",
  "keyboard",
];

export const IconPickerList = () => (
  <>
    {GoalIconsList.map((icon) => (
      <IconPicker key={icon} icon={icon} />
    ))}
  </>
);

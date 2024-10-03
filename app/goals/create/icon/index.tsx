// TODO: Add icon selection support for update goal form. Currently selecting an icon will always make new goal.
import { Stack, useRouter } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { fontFamily } from "~/lib/font";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import { useGoalFormStore } from "../goal-store";
import { useShallow } from "zustand/react/shallow";
import { GOAL_ICONS } from "~/constants/goal-icons";
import { IconPicker } from "~/components/icon-picker";
import { ColorPicker } from "~/components/color-picker";

export default function IconScreen() {
  const [
    selectedIconColor,
    setSelectedIconColor,
    selectedIcon,
    setSelectedIcon,
  ] = useGoalFormStore(
    useShallow((s) => [
      s.selectedIconColor,
      s.setSelectedIconColor,
      s.selectedIcon,
      s.setSelectedIcon,
    ])
  );
  const router = useRouter();

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
                <Pressable
                  className="absolute left-0.5"
                  hitSlop={20}
                  onPress={() => router.dismiss(1)}
                >
                  <ChevronLeft color="#fff" size={35} />
                </Pressable>
                <Text style={{ fontFamily: fontFamily.openSans.bold }}>
                  Icon
                </Text>
              </View>
              <View className="mt-6 flex-row justify-evenly px-4">
                <ColorPicker
                  color="#2AA8CF"
                  selectedIconColor={selectedIconColor}
                  setSelectedIconColor={setSelectedIconColor}
                />
                <ColorPicker
                  color="#2A67F5"
                  selectedIconColor={selectedIconColor}
                  setSelectedIconColor={setSelectedIconColor}
                />
                <ColorPicker
                  color="#299240"
                  selectedIconColor={selectedIconColor}
                  setSelectedIconColor={setSelectedIconColor}
                />
                <ColorPicker
                  color="#E1861D"
                  selectedIconColor={selectedIconColor}
                  setSelectedIconColor={setSelectedIconColor}
                />
                <ColorPicker
                  color="#D42C2C"
                  selectedIconColor={selectedIconColor}
                  setSelectedIconColor={setSelectedIconColor}
                />
                <ColorPicker
                  color="#982ABF"
                  selectedIconColor={selectedIconColor}
                  setSelectedIconColor={setSelectedIconColor}
                />
              </View>
            </View>
          ),
        }}
      />
      <FlatList
        contentContainerStyle={{
          paddingBottom: 80,
        }}
        contentContainerClassName="flex flex-row flex-wrap gap-4 min-h-full bg-[#082139] p-4"
        data={GOAL_ICONS}
        renderItem={({ item }) => (
          <IconPicker
            icon={item}
            selectedIcon={selectedIcon}
            selectedIconColor={selectedIconColor}
            setSelectedIcon={setSelectedIcon}
          />
        )}
      />
    </>
  );
}

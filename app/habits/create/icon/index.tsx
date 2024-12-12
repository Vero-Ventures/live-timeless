import { router, Stack } from "expo-router";
import { FlatList, Pressable, View } from "react-native";
import { Text } from "~/components/ui/text";
import { ChevronLeft } from "~/lib/icons/ChevronLeft";
import { useHabitFormStore } from "~/stores/habit-store";
import { useShallow } from "zustand/react/shallow";
import { HABIT_ICONS } from "~/constants/habit-icons";
import { IconPicker } from "~/components/habits/icon-picker";
import { ColorPicker } from "~/components/habits/color-picker";

export default function IconScreen() {
  const [
    selectedIconColor,
    setSelectedIconColor,
    selectedIcon,
    setSelectedIcon,
  ] = useHabitFormStore(
    useShallow((s) => [
      s.selectedIconColor,
      s.setSelectedIconColor,
      s.selectedIcon,
      s.setSelectedIcon,
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
          headerBackButtonDisplayMode: "minimal",
          header: () => (
            <View className="h-48 border-b border-b-[#fff]/10 bg-[#0b1a28] pt-20">
              <View className="relative flex flex-row items-center justify-center gap-2">
                <Pressable
                  className="absolute left-0.5"
                  hitSlop={20}
                  onPress={() => router.dismiss()}
                >
                  <ChevronLeft color="#fff" size={35} />
                </Pressable>
                <Text className="font-bold">Icon</Text>
              </View>
              <View className="mt-6 flex-row justify-evenly px-4">
                {[
                  "#2AA8CF",
                  "#2A67F5",
                  "#299240",
                  "#E1861D",
                  "#D42C2C",
                  "#982ABF",
                ].map((color) => (
                  <ColorPicker
                    key={color}
                    color={color}
                    selectedIconColor={selectedIconColor}
                    setSelectedIconColor={setSelectedIconColor}
                  />
                ))}
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
        data={HABIT_ICONS}
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

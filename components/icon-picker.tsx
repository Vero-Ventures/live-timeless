import {
  AntDesign,
  Entypo,
  EvilIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
  Fontisto,
  Foundation,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
  SimpleLineIcons,
  Zocial,
} from "@expo/vector-icons";

import type { ComponentProps } from "react";
import { Pressable, View } from "react-native";
import { cn } from "~/lib/utils";

type AntDesignNames = ComponentProps<typeof AntDesign>["name"];
type EntypoNames = ComponentProps<typeof Entypo>["name"];
type EvilIconsNames = ComponentProps<typeof EvilIcons>["name"];
type FeatherNames = ComponentProps<typeof Feather>["name"];
type FontAwesomeNames = ComponentProps<typeof FontAwesome>["name"];
type FontAwesome5Names = ComponentProps<typeof FontAwesome5>["name"];
type FontAwesome6Names = ComponentProps<typeof FontAwesome6>["name"];
type FontistoNames = ComponentProps<typeof Fontisto>["name"];
type FoundationNames = ComponentProps<typeof Foundation>["name"];
type IoniconsNames = ComponentProps<typeof Ionicons>["name"];
type MaterialCommunityIconsNames = ComponentProps<
  typeof MaterialCommunityIcons
>["name"];
type MaterialIconsNames = ComponentProps<typeof MaterialIcons>["name"];
type OcticonsNames = ComponentProps<typeof Octicons>["name"];
type SimpleLineIconsNames = ComponentProps<typeof SimpleLineIcons>["name"];
type ZocialNames = ComponentProps<typeof Zocial>["name"];

export type Icon =
  | { component: typeof AntDesign; name: AntDesignNames }
  | { component: typeof Entypo; name: EntypoNames }
  | { component: typeof EvilIcons; name: EvilIconsNames }
  | { component: typeof Feather; name: FeatherNames }
  | { component: typeof FontAwesome; name: FontAwesomeNames }
  | { component: typeof FontAwesome5; name: FontAwesome5Names }
  | { component: typeof FontAwesome6; name: FontAwesome6Names }
  | { component: typeof Fontisto; name: FontistoNames }
  | { component: typeof Foundation; name: FoundationNames }
  | { component: typeof Ionicons; name: IoniconsNames }
  | {
      component: typeof MaterialCommunityIcons;
      name: MaterialCommunityIconsNames;
    }
  | { component: typeof MaterialIcons; name: MaterialIconsNames }
  | { component: typeof Octicons; name: OcticonsNames }
  | { component: typeof SimpleLineIcons; name: SimpleLineIconsNames }
  | { component: typeof Zocial; name: ZocialNames };

interface IconPickerProps {
  icon: Icon;
  selectedIconColor: string;
  selectedIcon: string | null;
  setSelectedIcon: (selectedIcon: string) => void;
}

export function IconPicker({
  icon,
  selectedIconColor,
  selectedIcon,
  setSelectedIcon,
}: IconPickerProps) {
  const isSelected = selectedIcon === icon.name;
  return (
    <Pressable onPress={() => setSelectedIcon(icon.name)}>
      <View
        className={cn(
          "items-center justify-center rounded-xl bg-[#0e2942] p-4",
          isSelected && `bg-[${selectedIconColor}]`
        )}
      >
        <icon.component
          name={icon.name}
          size={32}
          color={isSelected ? "#fff" : "#4a7ba6"}
        />
      </View>
    </Pressable>
  );
}

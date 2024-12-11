import { Check } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { ICON_COLORS } from "~/constants/Colors";
import { cn } from "~/lib/utils";

interface ColorPickerProps {
  color: string;
  selectedIconColor: string;
  setSelectedIconColor: (selectedIconColor: string) => void;
}

export function ColorPicker({
  color,
  selectedIconColor,
  setSelectedIconColor,
}: ColorPickerProps) {
  const isSelected = selectedIconColor === color;

  return (
    <Pressable
      onPress={() => {
        setSelectedIconColor(color);
      }}
    >
      <View
        className={cn(
          `h-12 w-12 items-center justify-center rounded-full bg-transparent`,
          ICON_COLORS[color].className.border,
          isSelected && "border-2"
        )}
      >
        <View
          className={cn(
            `h-10 w-10 rounded-full`,
            ICON_COLORS[color].className.backgroundColor
          )}
        >
          {!!isSelected && <Check color="#fff" className="m-auto" />}
        </View>
      </View>
    </Pressable>
  );
}

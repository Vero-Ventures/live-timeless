import { Check } from "lucide-react-native";
import { Pressable, View } from "react-native";
import { cn } from "~/lib/utils";

interface ColorPickerProps {
  color: string;
  selectedIconColor: string;
  bgColor: string;
  setSelectedIconColor: (selectedIconColor: string) => void;
  setSelectedIconBGColor: (selectedIconBGColor: string) => void;
}

export function ColorPicker({
  color,
  selectedIconColor,
  setSelectedIconColor,
  setSelectedIconBGColor,
  bgColor,
}: ColorPickerProps) {
  const isSelected = selectedIconColor === color;

  return (
    <Pressable
      onPress={() => {
        setSelectedIconColor(color);
        setSelectedIconBGColor(bgColor);
      }}
    >
      <View
        className={cn(
          `h-12 w-12 items-center justify-center rounded-full bg-transparent border-[${selectedIconColor}]`,
          isSelected && "border-2"
        )}
      >
        <View className={cn(`h-10 w-10 rounded-full bg-[${color}]`)}>
          {!!isSelected && <Check color="#fff" className="m-auto" />}
        </View>
      </View>
    </Pressable>
  );
}

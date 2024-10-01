import { Check } from "lucide-react-native";
import { Pressable, View } from "react-native";
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

import { View } from "react-native";
import { Text } from "../ui/text";

interface StatCardProps {
  titleIcon?: React.ReactNode;
  title: string;
  value: string;
}

export function StatCard({ titleIcon, title, value }: StatCardProps) {
  return (
    <View className="flex-1 flex-col gap-1 rounded-xl bg-card p-4">
      <View className="flex flex-row items-center gap-2">
        {titleIcon}
        <Text className="text-sm uppercase text-gray-400">{title}</Text>
      </View>
      <Text className="text-xl font-bold text-white">{value}</Text>
    </View>
  );
}

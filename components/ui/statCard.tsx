import { ArrowBigDown, ArrowBigUp } from "lucide-react-native";
import { View, Text } from "react-native";

interface StatCardProps {
  titleIcon?: React.ReactNode;
  title: string;
  value: string;
  comparison: string;
  status: "positive" | "negative" | "neutral";
}

const StatCard = ({
  titleIcon,
  title,
  value,
  comparison,
  status,
}: StatCardProps) => {
  const colour =
    status === "positive"
      ? "text-green-500"
      : status === "negative"
        ? "text-red-500"
        : "text-gray-500";

  const icon =
    status === "positive" ? (
      <ArrowBigUp size={16} color="green" fill="green" />
    ) : status === "negative" ? (
      <ArrowBigDown size={16} color="red" fill="red" />
    ) : (
      <></>
    );
  return (
    <View className="flex w-[48%] flex-col gap-1 rounded-xl border border-gray-600 p-4">
      <View className="flex flex-row items-center gap-2">
        {titleIcon}
        <Text className="text-sm uppercase text-gray-400">{title}</Text>
      </View>
      <Text className="text-xl font-bold text-white">{value}</Text>
      <Text className={colour}>
        {icon}
        {comparison}
      </Text>
    </View>
  );
};
export { StatCard };

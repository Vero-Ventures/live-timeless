import { FlatList, Pressable, View } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Link } from "expo-router";
import { Text } from "~/components/ui/text";
import SearchInput from "~/components/search-input";
import { Coins } from "~/lib/icons/Coins";
import { HandHeart } from "~/lib/icons/HandHeart";
import { Gift } from "~/lib/icons/Gift";
import { TentTree } from "~/lib/icons/TentTree";

export default function RewardsPage() {
  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "#082139" }}>
      <View className="gap-10 p-4">
        <View className="flex flex-row items-center gap-4">
          <Text>
            <Coins className="text-primary" size={40} />
          </Text>
          <View className="gap-2">
            <Text className="text-2xl font-bold">100</Text>
            <Text className="text-md">LT Token Balance</Text>
          </View>
        </View>
        <View className="gap-3">
          <Text className="text-2xl font-semibold">Available Rewards</Text>
          <SearchInput />
        </View>
      </View>
      <FlatList
        data={rewardData}
        ItemSeparatorComponent={() => <View className="py-2" />}
        renderItem={({ item }) => (
          <RewardItem
            id={item.id}
            Icon={item.icon}
            type={item.type}
            token={item.token}
            name={item.name}
            description={item.description}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </SafeAreaView>
  );
}

export const rewardData = [
  {
    id: "0",
    icon: HandHeart,
    type: "Charitable donation",
    token: 30,
    name: "Reward Name",
    description: "This is a short description for this reward",
  },
  {
    id: "1",
    icon: Gift,
    type: "Gift card",
    token: 20,
    name: "Reward Name",
    description: "This is a short description for this reward",
  },
  {
    id: "2",
    icon: TentTree,
    type: "Experience",
    token: 50,
    name: "Reward Name",
    description: "This is a short description for this reward",
  },
  {
    id: "3",
    icon: TentTree,
    type: "Experience",
    token: 40,
    name: "Reward Name",
    description: "This is a short description for this reward",
  },
  {
    id: "4",
    icon: Gift,
    type: "Gift card",
    token: 60,
    name: "Reward Name",
    description: "This is a short description for this reward",
  },
];

function RewardItem({
  id,
  Icon,
  type,
  token,
  name,
  description,
}: {
  id: string;
  Icon: LucideIcon;
  type: string;
  token: number;
  name: string;
  description: string;
}) {
  return (
    <Link
      href={{
        pathname: "/rewards/[id]",
        params: { id },
      }}
      asChild
    >
      <Pressable>
        <View className="justify-between bg-[#0e2942] px-6 py-5">
          <View className="flex flex-row justify-between">
            <View className="flex flex-row items-center gap-2">
              <View className="rounded-lg bg-white/20 p-1 backdrop-blur-sm">
                <Icon className="text-foreground" />
              </View>
              <Text>{type}</Text>
            </View>
            <Text className="font-medium">{token} tokens</Text>
          </View>
          <View className="gap-1">
            <Text className="text-xl font-semibold">{name}</Text>
            <Text className="line-clamp-2 overflow-ellipsis">
              {description}
            </Text>
          </View>
        </View>
      </Pressable>
    </Link>
  );
}

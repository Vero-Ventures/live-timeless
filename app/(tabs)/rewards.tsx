import {
  FlatList,
  Pressable,
  View,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Link, useLocalSearchParams } from "expo-router";
import { Text } from "~/components/ui/text";
import SearchInput from "~/components/search-input";
import { Coins } from "~/lib/icons/Coins";
import { api } from "~/convex/_generated/api";
import { useAction, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import type { ListProductsResponseProductsInner } from "tremendous";
import { MaterialIcons } from "@expo/vector-icons";

export default function RewardsPage() {
  const [rewards, setRewards] = useState<
    ListProductsResponseProductsInner[] | null
  >(null);
  const { query } = useLocalSearchParams<{ query?: string }>();
  const user = useQuery(api.users.currentUser);
  const fetchRewards = useAction(api.tremendous.listRewardsAction);

  useEffect(() => {
    fetchRewards().then((products) => setRewards(products));
  }, [fetchRewards]);

  const filteredRewards = rewards
    ? query
      ? rewards.filter((reward) =>
          reward.name.toLowerCase().includes(query.toLowerCase())
        )
      : rewards
    : null;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#082139" }}>
      <View className="gap-10 bg-background p-4">
        <View className="flex flex-row items-center gap-4">
          <Text>
            <Coins className="text-primary" size={40} />
          </Text>
          <View className="gap-2">
            <Text className="text-2xl font-bold">{user?.points ?? 0}</Text>
            <Text className="text-md">LT Token Balance</Text>
          </View>
        </View>
        <View className="gap-3">
          <Text className="text-2xl font-semibold">Available Rewards</Text>
          <SearchInput query={query} />
        </View>
      </View>
      {filteredRewards ? (
        <FlatList
          data={filteredRewards}
          ItemSeparatorComponent={() => <View className="py-2" />}
          renderItem={({ item }) => <RewardItem product={item} />}
        />
      ) : (
        <View className="h-full flex-1 items-center justify-center bg-background">
          <ActivityIndicator />
        </View>
      )}
    </SafeAreaView>
  );
}

interface RewardItemProps {
  product: ListProductsResponseProductsInner;
}

function RewardItem({ product }: RewardItemProps) {
  return (
    <Link
      href={{
        pathname: "/rewards/[id]",
        params: { id: product.id },
      }}
      asChild
    >
      <Pressable>
        <View className="relative">
          <View className="absolute h-full w-full bg-[#0e2942]/50"></View>
          {!!product.images.length && (
            <Image
              src={product.images.at(0)?.src}
              className="-z-10 h-[200px] w-full"
            />
          )}

          <View className="absolute flex flex-row items-center gap-2 pl-4 pt-4">
            {product.category === "merchant_card" && (
              <>
                <View className="rounded-lg bg-slate-500 p-1">
                  <MaterialIcons
                    name="card-giftcard"
                    size={20}
                    color={"white"}
                  />
                </View>
                <Text>Gift Card</Text>
              </>
            )}
          </View>
          <Text className="absolute bottom-0 pb-4 pl-4 text-xl font-semibold">
            {product.name}
          </Text>
        </View>
      </Pressable>
    </Link>
  );
}

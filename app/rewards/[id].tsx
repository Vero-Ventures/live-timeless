import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  View,
  Image,
  SafeAreaView,
  Pressable,
} from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useEffect, useState } from "react";
import { useAction } from "convex/react";
import { api } from "~/convex/_generated/api";
import type { ListProductsResponseProductsInner } from "tremendous";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { MaterialIcons } from "@expo/vector-icons";
import DOMContent from "~/components/rewards/dom-content";

export default function SingleRewardsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const getReward = useAction(api.tremendous.getRewardAction);
  const [reward, setReward] =
    useState<ListProductsResponseProductsInner | null>(null);

  useEffect(() => {
    getReward({ productId: id }).then((product) => setReward(product));
  }, [getReward, id]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#082139" }}>
      <Stack.Screen
        options={{
          header: () =>
            reward ? (
              <View className="relative w-full">
                <View className="absolute h-full w-full bg-[#0e2942]/50"></View>
                {!!reward.images.length && (
                  <Image
                    src={reward.images.at(0)?.src}
                    className="-z-10 h-[280px] w-full"
                  />
                )}
                <Pressable
                  className="absolute top-12 pl-2"
                  hitSlop={20}
                  onPress={() => router.dismiss()}
                >
                  <ArrowLeft color="#fff" size={40} />
                </Pressable>
                {reward.category === "merchant_card" && (
                  <View className="absolute top-28 flex flex-row gap-2 pl-4">
                    <View className="rounded-lg bg-slate-500 p-1">
                      <MaterialIcons
                        name="card-giftcard"
                        size={20}
                        color={"white"}
                      />
                    </View>
                    <Text>Gift Card</Text>
                  </View>
                )}
                <Text className="absolute bottom-0 pb-4 pl-4 text-3xl font-bold">
                  {reward.name}
                </Text>
              </View>
            ) : null,
        }}
      />
      {reward ? (
        <>
          <View className="flex-1 bg-[#0e2942] p-4">
            {!!reward.description && (
              <>
                <Text className="text-2xl font-bold">About this reward</Text>
                <DOMContent content={reward.description} />
              </>
            )}
            {!!reward.disclosure && (
              <>
                <Text className="text-2xl font-bold">Terms and Conditions</Text>
                <DOMContent content={reward.disclosure} />
              </>
            )}
          </View>
          <View className="px-5 pb-10 pt-5">
            <Button size="lg">
              <Text>Redeem</Text>
            </Button>
          </View>
        </>
      ) : (
        <View className="h-full flex-1 items-center justify-center bg-background">
          <ActivityIndicator />
        </View>
      )}
    </SafeAreaView>
  );
}

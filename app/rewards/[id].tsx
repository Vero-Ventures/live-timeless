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
import { useAction, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import type {
  ListProductsResponseProductsInner,
  ListProductsResponseProductsInnerSkusInner,
} from "tremendous";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { MaterialIcons } from "@expo/vector-icons";
import DOMContent from "~/components/rewards/dom-content";
import {
  convertTokensToDollars,
  getMinAndMaxProductDenominations,
} from "~/lib/tremendous";

export default function SingleRewardsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useQuery(api.users.currentUser);
  const getProduct = useAction(api.tremendous.getProductAction);
  const redeemReward = useAction(api.tremendous.redeemRewardAction);
  const [product, setProduct] =
    useState<ListProductsResponseProductsInner | null>(null);
  const [productDenominations, setProductDenominations] =
    useState<ListProductsResponseProductsInnerSkusInner | null>(null);

  useEffect(() => {
    getProduct({ productId: id }).then((product) => {
      const { minDenomination, maxDenomination } =
        getMinAndMaxProductDenominations(product.skus ?? []);

      setProduct(product);
      setProductDenominations({ min: minDenomination, max: maxDenomination });
    });
  }, [getProduct, id]);

  const isSufficientDollars =
    convertTokensToDollars(user?.tokens ?? 0) >=
    (productDenominations?.min ?? 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#082139" }}>
      <Stack.Screen
        options={{
          header: () =>
            product ? (
              <View className="relative w-full">
                <View className="absolute h-full w-full bg-[#0e2942]/50"></View>
                {!!product.images.length && (
                  <Image
                    src={product.images.at(0)?.src}
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
                {product.category === "merchant_card" && (
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
                  {product.name}
                </Text>
              </View>
            ) : null,
        }}
      />
      {product ? (
        <>
          <View className="flex-1 bg-[#0e2942] px-4 pt-4">
            {!!product.description && (
              <>
                <Text className="text-2xl font-bold">About this reward</Text>
                <DOMContent content={product.description} />
              </>
            )}
            {!!product.disclosure && (
              <>
                <Text className="pb-4 text-2xl font-bold">
                  Terms and Conditions
                </Text>
                <DOMContent content={product.disclosure} />
              </>
            )}
          </View>
          <View className="px-5 pb-10 pt-5">
            {isSufficientDollars ? (
              <Button
                size="lg"
                onPress={async () => {
                  await redeemReward({
                    productId: id,
                    name: user?.name ?? "",
                    email: user?.email ?? "",
                    denomination: 30,
                  });
                }}
              >
                <Text>Redeem</Text>
              </Button>
            ) : (
              <Text className="text-center text-destructive">
                You need at least ${productDenominations?.min} worth of LT
                Tokens to redeem this reward.
              </Text>
            )}
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

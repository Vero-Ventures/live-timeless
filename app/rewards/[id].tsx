import { router, Stack, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  View,
  Image,
  SafeAreaView,
  Pressable,
  FlatList,
} from "react-native";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Separator } from "~/components/ui/separator";
import { useEffect, useState } from "react";
import { useAction, useMutation, useQuery } from "convex/react";
import { api } from "~/convex/_generated/api";
import type { ListProductsResponseProductsInner } from "tremendous";
import { ArrowLeft } from "~/lib/icons/ArrowLeft";
import { MaterialIcons } from "@expo/vector-icons";
import DOMContent from "~/components/rewards/dom-content";
import {
  convertDollarsToTokens,
  convertTokensToDollars,
  getProductSkus,
} from "~/lib/tremendous";
import { CircleCheckBig } from "~/lib/icons/CircleCheckBig";
import { Circle } from "~/lib/icons/Circle";
import { cn } from "~/lib/utils";

export default function SingleRewardsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const user = useQuery(api.users.currentUser);
  const getProduct = useAction(api.tremendous.getProductAction);
  const [product, setProduct] =
    useState<ListProductsResponseProductsInner | null>(null);
  const [productSkus, setProductSkus] = useState<number[] | null>(null);

  useEffect(() => {
    getProduct({ productId: id }).then((product) => {
      const skus = getProductSkus(product.skus ?? []);

      setProduct(product);
      setProductSkus(skus);
    });
  }, [getProduct, id]);

  const minimumSku = productSkus ? productSkus[0] : 0;
  const convertedDollars = convertTokensToDollars(user?.tokens ?? 0);
  const isSufficientDollars = convertedDollars >= minimumSku;

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
      {product && productSkus ? (
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
              <RedeemDialog
                productId={product.id}
                productName={product.name}
                productSkus={productSkus}
                username={user?.name ?? ""}
                email={user?.email ?? ""}
                convertedDollars={convertedDollars}
              />
            ) : (
              <Text className="text-center text-destructive">
                You need at least ${minimumSku} worth of LT Tokens to redeem
                this reward.
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

function RedeemDialog({
  productId,
  productName,
  productSkus,
  username,
  email,
  convertedDollars,
}: {
  productId: string;
  productName: string;
  productSkus: number[];
  username: string;
  email: string;
  convertedDollars: number;
}) {
  const [open, setOpen] = useState(false);
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [hasRedeemed, setHasRedeemed] = useState(false);
  const [unitValue, setUnitValue] = useState(productSkus[0]);
  const redeemReward = useAction(api.tremendous.redeemRewardAction);
  const updateUserTokens = useMutation(api.users.updateUserTokens);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" disabled={hasRedeemed}>
          <Text>{hasRedeemed ? "Redeemed" : "Redeem Tokens"}</Text>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] gap-5">
        <DialogHeader>
          <DialogTitle>{productName}</DialogTitle>
          {hasRedeemed ? (
            <GiftCardSuccessScreen unitValue={unitValue} />
          ) : (
            <>
              <Text className="mt-3">
                Unit Price:{" "}
                <Text className="text-primary">${unitValue} CAD</Text>
              </Text>
              <View className="mt-2 max-h-[300px]">
                <FlatList
                  data={productSkus}
                  keyExtractor={(item) => item.toString()}
                  ItemSeparatorComponent={() => <Separator />}
                  renderItem={({ item }) => (
                    <Pressable
                      disabled={isRedeeming}
                      onPress={() => setUnitValue(item)}
                      className="flex flex-row items-center justify-between p-4"
                    >
                      <View className="flex-1 flex-row justify-between">
                        <Text
                          className={cn(item === unitValue && "text-primary")}
                        >
                          ${item} CAD
                        </Text>
                        {item === unitValue ? <CircleCheckBig /> : <Circle />}
                      </View>
                    </Pressable>
                  )}
                />
              </View>
            </>
          )}
        </DialogHeader>
        {hasRedeemed ? (
          <DialogClose>
            <Button onPress={() => setOpen(false)}>
              <Text>Close</Text>
            </Button>
          </DialogClose>
        ) : (
          <DialogFooter>
            <Button
              disabled={isRedeeming || convertedDollars < unitValue}
              onPress={async () => {
                setIsRedeeming(true);

                // Send the reward
                await redeemReward({
                  productId,
                  name: username,
                  email,
                  denomination: unitValue,
                });
                // Update the user's tokens
                const tokens = convertDollarsToTokens(
                  convertedDollars - unitValue
                );
                await updateUserTokens({ tokens });

                setIsRedeeming(false);
                setHasRedeemed(true);
              }}
            >
              <Text>
                {isRedeeming
                  ? "Redeeming..."
                  : convertedDollars < unitValue
                    ? "Insufficient Tokens"
                    : "Redeem"}
              </Text>
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}

function GiftCardSuccessScreen({ unitValue }: { unitValue: number }) {
  return (
    <View className="mt-6 gap-6">
      <Text className="text-center text-lg font-semibold">
        Congratulations!
      </Text>
      <CircleCheckBig className="mx-auto text-green-500" size={55} />
      <View className="gap-2">
        <Text className="text-center text-lg font-semibold">
          Your ${unitValue} Gift Card is Ready!
        </Text>
        <Text className="text-center">
          Check your email for the redemption link and instructions.
        </Text>
      </View>
    </View>
  );
}

import { Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { rewardData } from "../(tabs)/rewards";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";

export default function SingleRewardsPage() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const reward = rewardData.find((reward) => reward.id === id);
  if (!reward) {
    return null;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: "",
          headerBackTitleVisible: false,
          headerTransparent: true,
        }}
      />
      <View className="h-full" style={{ backgroundColor: "#082139" }}>
        <View className="h-1/3 justify-between px-6 pb-10 pt-[112px]">
          <View className="flex flex-row justify-between">
            <Text>{reward.type}</Text>
            <Text className="font-medium">{reward.token} tokens</Text>
          </View>
          <View className="gap-1">
            <Text className="text-3xl font-semibold">{reward.name}</Text>
            <Text className="line-clamp-2 overflow-ellipsis">
              {reward.description}
            </Text>
          </View>
        </View>
        <View className="flex-1" style={{ backgroundColor: "#0e2942" }}>
          <ScrollView
            className=""
            contentContainerStyle={{
              paddingBottom: 30,
            }}
          >
            <View className="gap-12 px-4 py-8">
              <View className="gap-4">
                <Text className="text-2xl font-semibold">
                  About this reward
                </Text>
                <Text>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </Text>
              </View>
              <View className="gap-4">
                <Text className="text-2xl font-semibold">
                  Instructions on How to Use
                </Text>
                <Text>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>

        <View className="px-5 pb-10 pt-5">
          <Button size="lg">
            <Text>Redeem for {reward.token} tokens</Text>
          </Button>
        </View>
      </View>
    </>
  );
}

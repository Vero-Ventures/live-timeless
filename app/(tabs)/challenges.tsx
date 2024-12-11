import { useQuery } from "convex/react";
import { ActivityIndicator, FlatList, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import {
  differenceInHours,
  differenceInDays,
  isBefore,
  isAfter,
} from "date-fns";
import { Link } from "expo-router";
import { Separator } from "~/components/ui/separator";

const getChallengeStatus = (startDate: Date, endDate: Date) => {
  const currentDate = new Date();

  if (isBefore(currentDate, startDate)) {
    const days = differenceInDays(startDate, currentDate);
    const hours = differenceInHours(startDate, currentDate) % 24; // Remaining hours after full days
    return `Starts ${days}D ${hours}H`;
  }

  if (isAfter(currentDate, startDate) && isBefore(currentDate, endDate)) {
    const days = differenceInDays(endDate, currentDate);
    const hours = differenceInHours(endDate, currentDate) % 24;
    return `${days}D ${hours}H left`;
  }

  return "Ended";
};

export default function ChallengesScreen() {
  const challenges = useQuery(api.challenges.listChallenges);

  return (
    <SafeAreaView style={{ height: "100%", backgroundColor: "#082139" }}>
      <View className="flex-1 gap-4 p-4">
        <Text className="text-2xl font-bold">Challenges</Text>
        <Separator className="my-6 bg-[#fff]/10" />
        {challenges ? (
          <FlatList
            contentContainerStyle={{
              paddingBottom: 60,
              gap: 10,
            }}
            data={challenges}
            ListEmptyComponent={() => (
              <Text className="text-center">No Challenges yet.</Text>
            )}
            renderItem={({ item }) => (
              <Link
                href={{
                  pathname: "/challenges/[id]",
                  params: { id: item._id },
                }}
                asChild
              >
                <Pressable className="rounded-lg bg-[#0e2942]">
                  <View className="flex-row items-center justify-between gap-4 px-4 py-4">
                    <Text className="text-xl font-semibold">{item.name}</Text>

                    <View className="rounded-lg bg-[#3d7bb6] p-2">
                      <Text className="text-sm uppercase">
                        {getChallengeStatus(
                          new Date(item.startDate),
                          new Date(item.endDate)
                        )}
                      </Text>
                    </View>
                  </View>
                </Pressable>
              </Link>
            )}
            keyExtractor={(item) => item._id}
          />
        ) : (
          <View className="h-full flex-1 items-center justify-center bg-background">
            <ActivityIndicator />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

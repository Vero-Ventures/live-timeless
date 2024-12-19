import { useMutation, useQuery } from "convex/react";
import { Stack, useLocalSearchParams } from "expo-router";
import { Target } from "~/lib/icons/Target";
import { Calendar } from "~/lib/icons/Calendar";
import { Coins } from "~/lib/icons/Coins";
import { ActivityIndicator, SafeAreaView, View, FlatList } from "react-native";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { User2 } from "lucide-react-native";
import { Badge } from "~/components/ui/badge";
import React from "react";
import { isAfter, isBefore } from "date-fns";
import { cn } from "~/lib/utils";

export default function ChallengeScreen() {
  const { id } = useLocalSearchParams<{
    id: Id<"challenges">;
  }>();

  const user = useQuery(api.users.currentUser);

  const challenge = useQuery(api.challenges.getChallengeByIdWthHasJoined, {
    challengeId: id,
  });

  const participants =
    useQuery(api.challenges.getChallengeParticipants, {
      challengeId: id,
    }) || [];

  const joinChallenge = useMutation(api.challenges.joinChallenge);
  const leaveChallenge = useMutation(api.challenges.leaveChallenge);

  const handleJoinChallenge = async (challengeId: Id<"challenges">) => {
    await joinChallenge({ challengeId });
  };
  const handleLeaveChallenge = async (challengeId: Id<"challenges">) => {
    await leaveChallenge({ challengeId });
  };

  return (
    <SafeAreaView className="h-full bg-background">
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff",
          headerTitle: () => (
            <View>
              <Text className="text-xl font-bold">
                {challenge ? challenge.name : ""}
              </Text>
            </View>
          ),
          headerRight: () =>
            !!challenge && (
              <ChallengeStatus
                startDate={challenge.startDate}
                endDate={challenge.endDate}
              />
            ),
          headerBackButtonDisplayMode: "minimal",
        }}
      />
      {challenge && user ? (
        <View className="relative h-full gap-8 p-4 pt-8">
          <View className="gap-6">
            <View className="flex-row items-center gap-2">
              <Target className="stroke-gray-400" />
              <Text className="text-gray-400">
                {challenge.unitValue} {challenge.unit} {challenge.recurrence}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Calendar className="stroke-gray-400" />
              <Text className="text-gray-400">
                {`${new Date(challenge.startDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })} - ${new Date(challenge.endDate).toLocaleDateString(
                  "en-US",
                  {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }
                )}`}
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <Coins className="stroke-gray-400" />
              <Text className="text-gray-400">
                {challenge.tokens} tokens per completion
              </Text>
            </View>
          </View>
          {!!challenge.description && (
            <View className="gap-2">
              <Text className="text-2xl font-bold">About</Text>
              <Text className="leading-relaxed">{challenge.description}</Text>
            </View>
          )}
          <View className="flex-1 gap-4">
            <Text className="text-2xl font-bold">Leaderboard</Text>
            <FlatList
              contentContainerStyle={{
                paddingBottom: 8,
              }}
              ListHeaderComponentStyle={{ marginBottom: 8 }}
              data={participants}
              ItemSeparatorComponent={() => (
                <Separator className="my-4 h-0.5 bg-[#fff]/10" />
              )}
              ListEmptyComponent={() => (
                <Text className="pt-4 text-center">No participants yet.</Text>
              )}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <View
                  className={cn(
                    "flex-row items-center justify-between px-4 py-2",
                    item.userId === user._id &&
                      "rounded-lg border border-input bg-card"
                  )}
                >
                  <View className="flex-row items-center gap-2">
                    {!!item?.image ? (
                      <Avatar
                        className="size-10"
                        alt={`${item?.name}'s Avatar`}
                      >
                        <AvatarImage
                          source={{
                            uri: item.image,
                          }}
                        />
                      </Avatar>
                    ) : (
                      <View className="size-10 items-center justify-center rounded-full bg-input">
                        <User2 size={20} className="stroke-foreground" />
                      </View>
                    )}
                    <Text className="text-sm">
                      {item.userId === user._id ? "You" : item?.name}
                    </Text>
                  </View>
                  <Text className="text-sm">
                    {item?.totalUnitsCompleted} {challenge.unit}
                  </Text>
                </View>
              )}
            />
          </View>
          <View className="">
            {!challenge.hasJoined ? (
              <Button
                onPress={async () => handleJoinChallenge(challenge._id)}
                size="lg"
                className="w-full"
              >
                <Text className="text-bold text-primary-foreground">
                  Join Challenge
                </Text>
              </Button>
            ) : (
              <Button
                variant="destructive"
                onPress={async () => handleLeaveChallenge(challenge._id)}
                size="lg"
                className="w-full"
              >
                <Text className="text-bold text-primary-foreground">
                  Leave Challenge
                </Text>
              </Button>
            )}
          </View>
        </View>
      ) : (
        <View className="h-full flex-1 justify-center bg-background">
          <ActivityIndicator />
        </View>
      )}
    </SafeAreaView>
  );
}

function ChallengeStatus({
  startDate,
  endDate,
}: {
  startDate: number;
  endDate: number;
}) {
  const today = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  const hasNotStarted = isBefore(today, start);
  const hasEnded = isAfter(today, end);

  return hasNotStarted ? (
    <Badge className="rounded-full bg-gray-500 px-4">
      <Text className="text-bg-gray-200">Not Started</Text>
    </Badge>
  ) : hasEnded ? (
    <Badge className="rounded-full bg-red-600 px-4">
      <Text className="text-red-600">Ended</Text>
    </Badge>
  ) : (
    <Badge className="rounded-full bg-green-600 px-4">
      <Text className="text-green-200">Started</Text>
    </Badge>
  );
}

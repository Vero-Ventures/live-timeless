import { useMutation, useQuery } from "convex/react";
import { Stack, useLocalSearchParams, Link } from "expo-router";
import { Target } from "~/lib/icons/Target";
import { Infinity } from "~/lib/icons/Infinity";
import { Calendar } from "~/lib/icons/Calendar";
import { ActivityIndicator, SafeAreaView, View } from "react-native";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";
import { fontFamily } from "~/lib/font";
import { Button } from "~/components/ui/button";
export default function ChallengeScreen() {
  const { id } = useLocalSearchParams<{
    id: Id<"challenges">;
  }>();

  const challenge = useQuery(api.challenges.getChallengeByIdWthHasJoined, {
    challengeId: id,
  });
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
            <Text
              className="text-xl"
              style={{ fontFamily: fontFamily.openSans.bold }}
            >
              {challenge ? challenge.name : ""}
            </Text>
          ),
          headerBackTitleVisible: false,
        }}
      />
      {challenge ? (
        <>
          <View className="flex-1 gap-8 p-4">
            <View className="gap-4">
              <Link
              href={{ pathname: "/challenges/goal", params: {id: challenge._id} }}
              asChild
              >
                <Button>
                  <Text className="text-bold text-primary-foreground">
                    Create Challenge Goals
                  </Text>
                </Button>
              </Link>
              <View className="flex-row items-center gap-2">
                <Target className="stroke-gray-400" />
                <Text className="text-gray-400">
                  {challenge.unitValue} {challenge.unit} {challenge.recurrence}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Infinity className="stroke-gray-400" />
                <Text className="text-gray-400">
                  {challenge.repeat.length === 7
                    ? "Everyday"
                    : challenge.repeat.map((day) => day.slice(0, 3)).join(", ")}
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Calendar className="stroke-gray-400" />
                <Text className="text-gray-400">
                  {`${new Date(challenge.startDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )} - ${new Date(challenge.endDate).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}`}
                </Text>
              </View>
            </View>
            <View className="gap-2">
              <Text className="text-2xl font-bold">About</Text>
              <Text className="leading-relaxed">{challenge.description}</Text>
            </View>
            <View className="gap-2">
              <Text className="text-2xl font-bold">Leaderboard</Text>
              <Text className="leading-relaxed">Coming Soon</Text>
            </View>
          </View>
          <View className="justify-center p-4">
            {!challenge.hasJoined ? (
              <Button
                onPress={async () => handleJoinChallenge(challenge._id)}
                size="lg"
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
              >
                <Text className="text-bold text-primary-foreground">
                  Leave Challenge
                </Text>
              </Button>
            )}
          </View>
        </>
      ) : (
        <View className="flex-1 bg-background">
          <ActivityIndicator />
        </View>
      )}
    </SafeAreaView>
  );
}

import { useMutation, useQuery } from "convex/react";
import { Stack, useLocalSearchParams } from "expo-router";
import { Target } from "~/lib/icons/Target";
import { Calendar } from "~/lib/icons/Calendar";
import { ActivityIndicator, SafeAreaView, View, FlatList } from "react-native";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import type { Id } from "~/convex/_generated/dataModel";
import { fontFamily } from "~/lib/font";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { Avatar, AvatarImage } from "~/components/ui/avatar";
import { User2 } from "lucide-react-native";
import { Badge } from "~/components/ui/badge";

const getChallengeStatus = (
  startDate: number,
  endDate: number
): React.ReactNode => {
  const currentDate = new Date();
  const start = new Date(startDate);
  const end = new Date(endDate);

  const hasNotStarted = currentDate < start;
  const hasEnded = currentDate > end;

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
};

export default function ChallengeScreen() {
  const { id } = useLocalSearchParams<{
    id: Id<"challenges">;
  }>();

  const challenge = useQuery(api.challenges.getChallengeByIdWthHasJoined, {
    challengeId: id,
  });

  const challengeParticipants =
    useQuery(api.challenges.getChallengeParticipants, {
      challengeId: id,
    }) || [];

  const sortedParticipants =
    useQuery(api.challenges.sortParticipantsByPoints, {
      userIds: challengeParticipants,
    }) || [];

  const joinChallenge = useMutation(api.challenges.joinChallenge);
  const leaveChallenge = useMutation(api.challenges.leaveChallenge);
  const deleteHabitAndHabitLogs = useMutation(
    api.habits.deleteHabitAndHabitLogs
  );
  const habits = useQuery(api.habits.listHabits);

  const deleteChallengeHabits = () => {
    const filteredHabits = habits?.filter((habit) => habit.challengeId === id);
    filteredHabits?.map((habit) => {
      deleteHabitAndHabitLogs({ habitId: habit._id });
    });
  };

  const handleJoinChallenge = async (challengeId: Id<"challenges">) => {
    await joinChallenge({ challengeId });
  };
  const handleLeaveChallenge = async (challengeId: Id<"challenges">) => {
    await leaveChallenge({ challengeId });
    deleteChallengeHabits();
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
              <Text
                className="text-xl"
                style={{ fontFamily: fontFamily.openSans.bold }}
              >
                {challenge ? challenge.name : ""}
              </Text>
            </View>
          ),
          headerRight: () =>
            !!challenge &&
            getChallengeStatus(challenge?.startDate, challenge?.endDate),
          headerBackTitleVisible: false,
        }}
      />
      {challenge ? (
        <>
          <View className="flex-1 gap-6 p-4">
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
            {!!challenge.description && (
              <View className="gap-2">
                <Text className="text-2xl font-bold">About</Text>
                <Text className="leading-relaxed">{challenge.description}</Text>
              </View>
            )}
            <View>
              <Text className="text-2xl font-bold">Leaderboard</Text>
              <FlatList
                contentContainerStyle={{
                  paddingBottom: 8,
                }}
                ListHeaderComponentStyle={{ marginBottom: 8 }}
                className="mt-6 border-t border-t-[#fff]/10 pt-6"
                data={sortedParticipants} // Use sorted participants
                ItemSeparatorComponent={() => (
                  <Separator className="my-4 h-0.5 bg-[#fff]/10" />
                )}
                ListEmptyComponent={() => (
                  <Text className="text-center">No users found.</Text>
                )}
                keyExtractor={(item) => item.userId}
                renderItem={({ item }) => (
                  <View className="flex-row items-center justify-between px-4">
                    <View className="flex-row items-center gap-2">
                      {!!item?.image ? (
                        <Avatar
                          className="h-32 w-32"
                          alt={`${item?.name}'s Avatar`}
                        >
                          <AvatarImage
                            source={{
                              uri: item.image,
                            }}
                          />
                        </Avatar>
                      ) : (
                        <View className="h-16 w-16 items-center justify-center rounded-full bg-input">
                          <User2 size={30} className="stroke-foreground" />
                        </View>
                      )}
                      <Text>{item?.name}</Text>
                    </View>
                    <Text>{item?.points ?? 0} POINTS</Text>
                  </View>
                )}
              />
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

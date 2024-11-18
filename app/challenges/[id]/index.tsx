import { useMutation, useQuery } from "convex/react";
import { Stack, useLocalSearchParams, Link } from "expo-router";
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

export default function ChallengeScreen() {
  const { id } = useLocalSearchParams<{
    id: Id<"challenges">;
  }>();

  const challenge = useQuery(api.challenges.getChallengeByIdWthHasJoined, {
    challengeId: id,
  });
  const joinChallenge = useMutation(api.challenges.joinChallenge);
  const leaveChallenge = useMutation(api.challenges.leaveChallenge);
  const createGoal = useMutation(api.goals.createGoal);
  const deleteGoalAndGoalLogs = useMutation(api.goals.deleteGoalAndGoalLogs);
  const userGoals = useQuery(api.goals.listGoals);
  const challengeGoals = useQuery(api.challengeGoals.listChallengeGoals);
  const filteredChallengeGoals = challengeGoals?.filter(
    (goal) => goal.challengeId === id
  );
  const createGoalLogsFromGoal = useMutation(
    api.goalLogs.createGoalLogsFromGoal
  );

  const importChallengeGoalsToUserGoals = () => {
    filteredChallengeGoals?.map(async (goal) => {
      const challengeGoal = {
        challengeId: goal.challengeId,
        dailyRepeat: goal.dailyRepeat,
        intervalRepeat: goal.intervalRepeat,
        monthlyRepeat: goal.monthlyRepeat,
        name: goal.name,
        repeatType: goal.repeatType,
        selectedIcon: goal.selectedIcon,
        selectedIconColor: goal.selectedIconColor,
        timeOfDay: goal.timeOfDay,
        timeReminder: goal.timeReminder,
        startDate: goal.startDate,
        unitType: goal.unitType,
        unitValue: goal.unitValue,
        unit: goal.unit,
        recurrence: goal.recurrence,
        weeks: goal.weeks,
        rate: goal.rate,
      };
      const goalId = await createGoal(challengeGoal);
      if (!goalId) {
        throw new Error("Failed to create goal");
      }

      await createGoalLogsFromGoal({
        goalId,
      });
    });
  };

  const deleteChallengeGoalsFromUserGoals = () => {
    const filteredUserGoals = userGoals?.filter(
      (goal) => goal.challengeId === id
    );
    filteredUserGoals?.map((goal) => {
      deleteGoalAndGoalLogs({ goalId: goal._id });
    });
  };

  const handleJoinChallenge = async (challengeId: Id<"challenges">) => {
    await joinChallenge({ challengeId });
    importChallengeGoalsToUserGoals();
  };
  const handleLeaveChallenge = async (challengeId: Id<"challenges">) => {
    await leaveChallenge({ challengeId });
    deleteChallengeGoalsFromUserGoals();
  };

  const getChallengeStatus = (
    startDate: number,
    endDate: number
  ): React.ReactNode => {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (currentDate < start) {
      return (
        <Text className="leading-relaxed text-primary-foreground">
          Not Started
        </Text>
      );
    } else if (currentDate > end) {
      return <Text className="leading-relaxed text-red-600">Ended</Text>;
    } else {
      return <Text className="leading-relaxed text-green-500">Started</Text>;
    }
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
                href={{
                  pathname: "/challenges/goal",
                  params: { id: challenge._id },
                }}
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
              <Text className="text-2xl font-bold">This challenge has</Text>
              {getChallengeStatus(challenge.startDate, challenge.endDate)}
            </View>
            <View className="gap-2">
              <Text className="text-2xl font-bold">Leaderboard</Text>
              <FlatList
                contentContainerStyle={{
                  paddingBottom: 60,
                }}
                className="mt-6 border-t border-t-[#fff]/10 pt-6"
                data={challenge.participants}
                ItemSeparatorComponent={() => (
                  <Separator className="my-4 h-0.5 bg-[#fff]/10" />
                )}
                ListEmptyComponent={() => (
                  <Text className="text-center">No users found.</Text>
                )}
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
            <View>
              <Text className="text-2xl font-bold">Challenge Goals</Text>
            </View>
            <FlatList
              contentContainerStyle={{
                paddingBottom: 60,
              }}
              className="border-t border-t-[#fff]/10 pt-6"
              data={filteredChallengeGoals}
              ItemSeparatorComponent={() => (
                <Separator className="my-4 h-0.5 bg-[#fff]/10" />
              )}
              ListEmptyComponent={() => (
                <Text className="text-center">
                  No goals found for this challenge.
                </Text>
              )}
              renderItem={({ item }) => <Text>{item.name}</Text>}
            />
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

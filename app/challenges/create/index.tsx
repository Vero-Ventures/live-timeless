import { Stack, router } from "expo-router";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import { useMutation } from "convex/react";
import { fontFamily } from "~/lib/font";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useChallengeFormStore } from "./challenge-store";
import { ScheduleStartDate, ScheduleEndDate } from "../schedule-date";
import { useShallow } from "zustand/react/shallow";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function CreateChallengePage() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff",
          headerTitle: () => (
            <Text style={{ fontFamily: fontFamily.openSans.bold }}>
              Create Challenge
            </Text>
          ),
          headerBackTitleVisible: false,
        }}
      />
      <CreateChallengeForm />
    </SafeAreaView>
  );
}

function CreateChallengeForm() {
  const [
    name,
    setName,
    description,
    setDescription,
    startDate,
    endDate,
    points,
    setPoints,
  ] = useChallengeFormStore(
    useShallow((s) => [
      s.name,
      s.setName,
      s.description,
      s.setDescription,
      s.startDate,
      s.endDate,
      s.points,
      s.setPoints,
    ])
  );

  const createChallenge = useMutation(api.challenges.createChallenge);

  return (
    <KeyboardAwareScrollView>
      <View className="flex flex-row items-center gap-2">
        <Input
          className="native:h-16 flex-1 rounded-xl border-0 bg-[#0e2942]"
          placeholder="Name of Challenge"
          value={name}
          onChangeText={setName}
        />
      </View>
      <View className="flex flex-row items-center gap-2">
        <Input
          className="native:h-16 flex-1 rounded-xl border-0 bg-[#0e2942]"
          placeholder="Description of Challenge"
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <ScheduleStartDate />
      <ScheduleEndDate />

      <View className="gap-2">
        <Label nativeID="points">Points</Label>
        <Input
          placeholder="Enter point value"
          value={points}
          onChangeText={setPoints}
          keyboardType="numeric"
        />
      </View>

      <Button
        onPress={async () => {
          const newChallenge = {
            name,
            description,
            repeat: ["daily"],
            unitType: "General",
            unitValue: 1,
            unit: "times",
            recurrence: "per day",
            startDate: startDate.getTime(),
            endDate: endDate.getTime(),
            points: points ? parseInt(points) : 0,
          };
          const challengeId = await createChallenge(newChallenge);
          if (!challengeId) {
            throw new Error("Failed to create challenge");
          }
          router.navigate("/challenges");
        }}
      >
        <Text>Add a sample challenge</Text>
      </Button>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#082139" },
  // listContentContainer: { paddingBottom: 60 },
});

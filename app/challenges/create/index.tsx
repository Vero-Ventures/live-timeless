import { Stack } from "expo-router";
import { SafeAreaView, StyleSheet} from "react-native";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
// import { useShallow } from "zustand/react/shallow";
import { useMutation } from "convex/react";
// import { useChallengeStore } from "./challenge-store";
import { fontFamily } from "~/lib/font";

export default function CreateChallengePage() {
  const createChallenge = useMutation(api.challenges.createChallenge);

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
      <Button onPress={() => createChallenge({
          name: "Sample Challenge",
          description: "Sample description",
          repeat: ["daily"],
          unitType: "General",
          unitValue: 1,
          unit: "times",
          recurrence: "per day",
          startDate: new Date().getTime(),
          endDate: new Date().getTime(),
          points: 10,
      })}>
        <Text>Add a sample challenge</Text>
      </Button> 

    </SafeAreaView>
  )
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#082139" },
  listContentContainer: { paddingBottom: 60 },
});

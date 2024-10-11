import { View, Pressable } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { Text } from '~/components/ui/text';  // Custom Text component
import { useQuery } from 'convex/react';
import { api } from '~/convex/_generated/api';  // Your API to fetch the goal
import { fontFamily } from '~/lib/font';  // Font library
import { Id } from "~/convex/_generated/dataModel";
import { useState } from 'react';

export default function StartGoalScreen() {
  const { goalId } = useLocalSearchParams<{ goalId: Id<"goals"> }>();
  const goal = useQuery(api.goals.getGoalById, { goalId });
  
  // Frontend state to track the unitValue decrement
  const [remaining, setRemaining] = useState(goal?.unitValue || 0);

  // When goal data is loaded, set the initial remaining count
  if (!goal) {
    return <Text>Loading...</Text>;
  }

  const handleCompleted = () => {
    // Ensure we don't decrement below zero
    setRemaining(prev => (prev > 0 ? prev - 1 : 0));
  };

  return (
    <View className="h-full gap-4 bg-[#0b1a28] p-4 justify-center items-center">
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff",  // Ensures white color for the header
          headerTitle: () => (
            <Text className="text-xl" style={{ fontFamily: fontFamily.openSans.bold }}>
              {goal.name} in Progress
            </Text>
          ),
          headerBackTitleVisible: false,
        }}
      />

      {/* Counter for Unit Value */}
      <Text
        className="text-white text-6xl"
        style={{ fontFamily: fontFamily.openSans.bold }}
      >
        {remaining}  {/* Show remaining count */}
      </Text>

      {/* "Left" Text */}
      <Text className="text-gray-400 text-xl">
        left
      </Text>

      {/* Button for "Completed" */}
      <Pressable
        className="mt-6 bg-green-600 p-4 rounded-lg w-full items-center"
        onPress={handleCompleted}  // Decrement the total when completed
      >
        <Text className="text-white text-lg" style={{ fontFamily: fontFamily.openSans.bold }}>
          Completed
        </Text>
      </Pressable>

      {/* Button for "Quit" */}
      <Pressable
        className="mt-4 bg-red-600 p-4 rounded-lg w-full items-center"
        onPress={() => console.log("Quit clicked")}
      >
        <Text className="text-white text-lg" style={{ fontFamily: fontFamily.openSans.bold }}>
          Quit
        </Text>
      </Pressable>
    </View>
  );
}

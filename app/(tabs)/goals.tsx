import { useKindeAuth } from "@kinde/expo";
import { UserProfile } from "@kinde/expo/dist/types";

import { useQuery } from "convex/react";
import type { FunctionReturnType } from "convex/server";
import { FlatList, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import { Button } from "~/components/ui/button";
import { Link } from "expo-router";
import { useEffect, useState } from "react";

export default function GoalsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const { getUserProfile } = useKindeAuth();
  const goals = useQuery(api.goals.list, { userId: user?.id ?? "" });

  useEffect(() => {
    async function fetchUser() {
      const userProfile = await getUserProfile();
      if (!userProfile) return;
      setUser(userProfile);
    }
    fetchUser();
  }, [getUserProfile]);

  return (
    <SafeAreaView
      style={{
        height: "100%",
      }}
    >
      <View className="gap-4">
        <FlatList
          className="p-4 create-goal-form"
          data={goals}
          ItemSeparatorComponent={() => <View className="p-2" />}
          renderItem={({ item }) => <GoalItem goal={item} />}
          keyExtractor={(g) => g._id}
        />
        <View>
          <Link href="/goals/create" asChild>
            <Button size="lg">
              <Text>Set Goal</Text>
            </Button>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

function GoalItem({
  goal,
}: {
  goal: FunctionReturnType<typeof api.goals.list>[number];
}) {
  return (
    <Link
      href={{
        pathname: "/goals/[id]",
        params: { id: goal._id },
      }}
      asChild
    >
      <Pressable>
        <Card>
          <CardHeader />
          <CardContent>
            <Text className="text-lg font-bold">{goal.name}</Text>
          </CardContent>
          <CardFooter />
        </Card>
      </Pressable>
    </Link>
  );
}

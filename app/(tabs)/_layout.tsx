import { View } from "react-native";
import { Tabs } from "expo-router";
import { User } from "~/lib/icons/User";
import { Goal, Mountain } from "lucide-react-native";
import { Star } from "~/lib/icons/Star";
import { Bot } from "~/lib/icons/Bot";

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: true,
          tabBarStyle: {
            height: 80,
            paddingTop: 6,
            backgroundColor: "#0b1a28",
            borderTopColor: "#0b1a28",
          },
        }}
      >
        <Tabs.Screen
          name="habits"
          options={{
            title: "Habits",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <View style={{ alignItems: "center" }}>
                <Goal color={color} />
              </View>
            ),
          }}
        />
        {/* <Tabs.Screen
          name="progress"
          options={{
            title: "Progress",
            headerShown: true,
            tabBarIcon: ({ color }) => (
              <View style={{ alignItems: "center" }}>
                <TrendingUp color={color} />
              </View>
            ),
          }}
        /> */}
        <Tabs.Screen
          name="challenges"
          options={{
            title: "Challenges",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <View style={{ alignItems: "center" }}>
                <Mountain color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="rewards"
          options={{
            title: "Rewards",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <View style={{ alignItems: "center" }}>
                <Star color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <View style={{ alignItems: "center" }}>
                <User color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="ai-advisor"
          options={{
            title: "Advisor",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <View style={{ alignItems: "center" }}>
                <Bot color={color} />
              </View>
            ),
          }}
        />
      </Tabs>
    </>
  );
}

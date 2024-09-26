import { View } from "react-native";
import { Tabs } from "expo-router";
import { User } from "~/lib/icons/User";
import { Home } from "~/lib/icons/Home";
import { Goal } from "lucide-react-native";
import { fontFamily } from "~/lib/font";
import { Star } from "~/lib/icons/Star";

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
          tabBarLabelStyle: {
            fontFamily: fontFamily.openSans.medium,
            fontSize: 10,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <View style={{ alignItems: "center" }}>
                <Home color={color} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="goals"
          options={{
            title: "Goals",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <View style={{ alignItems: "center" }}>
                <Goal color={color} />
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
      </Tabs>
    </>
  );
}

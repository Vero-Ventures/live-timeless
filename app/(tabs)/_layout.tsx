import { Text } from "~/components/ui/text";

import { Tabs } from "expo-router";
import { User } from "~/lib/icons/User";
import { Home } from "~/lib/icons/Home";
import { Goal } from "lucide-react-native";

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: true,

          tabBarStyle: {
            height: 80,
            paddingTop: 14,
            backgroundColor: "#082139",
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Text>
                <Home color={color} />
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="goals"
          options={{
            title: "Goals",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Text>
                <Goal color={color} />
              </Text>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Text>
                <User color={color} />
              </Text>
            ),
          }}
        />
      </Tabs>
    </>
  );
}

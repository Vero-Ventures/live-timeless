import { Text } from "~/components/ui/text";

import { Tabs } from "expo-router";
import { User } from "~/lib/icons/User";
import { Home } from "~/lib/icons/Home";

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: true,
          tabBarStyle: {
            height: 80,
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

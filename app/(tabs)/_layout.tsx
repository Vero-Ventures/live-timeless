import { View } from "react-native";
import { Tabs } from "expo-router";
import { User } from "~/lib/icons/User";
import { Home } from "~/lib/icons/Home";
import { Goal } from "lucide-react-native";
import { fontFamily } from "~/lib/font";
import { Star } from "~/lib/icons/Star";
import { Text } from "~/components/ui/text";

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: true,
          tabBarStyle: {
            height: 60,
            paddingTop: 10,
            paddingBottom: 2,
            backgroundColor: "#0b1a28",
            borderTopColor: "#0b1a28",
            position: "absolute",
            bottom: 30,
            left: 20,
            right: 20,
            borderRadius: 30,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 4,
            },
            shadowOpacity: 0.3,
            shadowRadius: 4.65,
            elevation: 8,
            justifyContent: "center",
            alignItems: "center",
          },
          tabBarLabelStyle: {
            fontFamily: fontFamily.openSans.medium,
            fontSize: 10,
            marginTop: 4,
          },
          tabBarItemStyle: {
            paddingVertical: 5,
            alignItems: "center",
            justifyContent: "center",
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
              <Text>
                <Star color={color} />
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

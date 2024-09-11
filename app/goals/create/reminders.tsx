import { type LucideIcon } from "lucide-react-native";

import { Stack } from "expo-router";
import { View } from "react-native";
import { Text } from "~/components/ui/text";
import { fontFamily } from "~/lib/font";
import { X } from "~/lib/icons/X";
import { Clock } from "~/lib/icons/Clock";
import { Plus } from "~/lib/icons/Plus";

export default function Reminders() {
  return (
    <>
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff",
          headerTitle: () => (
            <Text style={{ fontFamily: fontFamily.openSans.bold }}>
              Reminders
            </Text>
          ),
          headerBackTitleVisible: false,
        }}
      />
      <View className="p-5">
        <View className="gap-3">
          <Text
            className="text-sm text-muted-foreground"
            style={{
              fontFamily: fontFamily.openSans.semiBold,
              marginLeft: 8,
            }}
          >
            TIME
          </Text>
          <View className="rounded-xl bg-[#0e2942]">
            <TimeItem Icon={Clock} time="3:10 PM" />
            <TimeItem Icon={Clock} time="3:10 PM" />
            <TimeItem Icon={Clock} time="3:10 PM" />
            <AddItem Icon={Plus} label="Add" />
          </View>
        </View>
      </View>
    </>
  );
}

function TimeItem({ Icon, time }: { Icon: LucideIcon; time: string }) {
  return (
    <>
      <View className="flex flex-row items-center gap-4 p-5">
        <Icon />
        <View className="flex flex-1 flex-row items-center justify-between">
          <Text
            style={{
              fontFamily: fontFamily.openSans.semiBold,
            }}
          >
            {time}
          </Text>

          <X className="font-bold text-primary" size={20} />
        </View>
      </View>
    </>
  );
}

function AddItem({ Icon, label }: { Icon: LucideIcon; label: string }) {
  return (
    <>
      <View className="flex flex-row items-center gap-4 p-5">
        <Icon />
        <Text
          className="text-primary"
          style={{
            fontFamily: fontFamily.openSans.semiBold,
          }}
        >
          {label}
        </Text>
      </View>
    </>
  );
}

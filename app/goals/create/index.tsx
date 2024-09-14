import { useKindeAuth } from "@kinde/expo";

import { useMutation } from "convex/react";
import { Stack, useRouter, Link } from "expo-router";
import { AlertCircle, type LucideIcon } from "lucide-react-native";
import { useState } from "react";
import { Pressable, View } from "react-native";
import FormSubmitButton from "~/components/form-submit-button";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { Input } from "~/components/ui/input";
import { Text } from "~/components/ui/text";
import { api } from "~/convex/_generated/api";
import { fontFamily } from "~/lib/font";
import { Repeat } from "~/lib/icons/Repeat";
import { Crosshair } from "~/lib/icons/Crosshair";
import { Sun } from "~/lib/icons/Sun";
import { Bell } from "~/lib/icons/Bell";
import { ChevronRight } from "~/lib/icons/ChevronRight";
import ScheduleStartDate from "../schedule-start-date";
import { useCreateGoalFormStore } from "./create-goal-store";
import { formatTime } from "~/lib/date";
import { addOrdinalSuffix } from "~/lib/add-ordinal-suffix";
import Fa6Icons from "@expo/vector-icons/FontAwesome6";
import { cn } from "~/lib/utils";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function CreateGoalPage() {
  return (
    <View className="h-full gap-4 bg-background p-4">
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: "#0b1a28",
          },
          headerTintColor: "#fff",
          headerTitle: () => (
            <Text style={{ fontFamily: fontFamily.openSans.bold }}>
              Create Goal
            </Text>
          ),
          headerBackTitleVisible: false,
        }}
      />
      <CreateGoalForm />
    </View>
  );
}

function CreateGoalForm() {
  const {
    name,
    setName,
    timeOfDay,
    timeReminder,
    repeatType,
    dailyRepeat,
    monthlyRepeat,
    intervalRepeat,
    selectedIcon,
    selectedIconColor,
  } = useCreateGoalFormStore();
  const unitValue = useCreateGoalFormStore((s) => s.unitValue);
  const unit = useCreateGoalFormStore((s) => s.unit);
  const recurrence = useCreateGoalFormStore((s) => s.recurrence);
  const [description, setDescription] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const createGoal = useMutation(api.goals.create);
  const router = useRouter();
  const { getUserProfile } = useKindeAuth();

  const isAnyTime = timeOfDay.length === 3;

  const getRepeatValue = () => {
    switch (repeatType) {
      case "daily":
        return dailyRepeat.length === 7
          ? "Everyday"
          : dailyRepeat.map((day) => day.slice(0, 3)).join(", ");
      case "monthly":
        return `Every month on ${monthlyRepeat.map(addOrdinalSuffix).join(", ")}`;
      case "interval":
        return `Every ${intervalRepeat} days`;
      default:
        return "Not set";
    }
  };

  return (
    <View className="gap-4">
      {error && (
        <Alert icon={AlertCircle} variant="destructive" className="max-w-xl">
          <AlertTitle>Something went wrong!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <View className="flex flex-row items-center gap-2">
        <Link href="/goals/create/icon" asChild>
          <Pressable className="rounded-xl bg-[#0e2942] p-4 px-6">
            {selectedIcon ? (
              <MaterialCommunityIcons
                name={selectedIcon}
                size={32}
                color={selectedIconColor}
              />
            ) : (
              <Fa6Icons name="question" size={32} color={selectedIconColor} />
            )}
          </Pressable>
        </Link>
        <Input
          className="native:h-16 flex-1 rounded-xl border-0 bg-[#0e2942]"
          placeholder="Name of Goal"
          value={name}
          onChangeText={setName}
        />
      </View>
      <View className="rounded-xl bg-[#0e2942]">
        <Link href="/goals/create/repeat" asChild>
          <Pressable>
            <ScheduleItem
              Icon={Repeat}
              iconBgColor="bg-[#2A67F5]"
              title="REPEAT"
              value={getRepeatValue()}
            />
          </Pressable>
        </Link>
        <Link href="/goals/create/frequency" asChild>
          <Pressable>
            <ScheduleItem
              Icon={Crosshair}
              iconBgColor="bg-[#0EAF0A]"
              title="FREQUENCY"
              value={`${unitValue} ${unit} ${recurrence}`}
            />
          </Pressable>
        </Link>
        <Link href="/goals/create/time-of-day" asChild>
          <Pressable>
            <ScheduleItem
              Icon={Sun}
              iconBgColor="bg-[#F0A122]"
              title="TIME OF DAY"
              value={isAnyTime ? "Any Time" : timeOfDay.join(" and ")}
            />
          </Pressable>
        </Link>
      </View>
      <View className="rounded-xl bg-[#0e2942]">
        <Link href="/goals/create/reminders" asChild>
          <Pressable>
            <ScheduleItem
              Icon={Bell}
              iconBgColor="bg-[#9037D1]"
              title="REMINDERS"
              value={formatTime(timeReminder)}
            />
          </Pressable>
        </Link>
      </View>

      <ScheduleStartDate />

      <FormSubmitButton
        size="lg"
        isPending={isPending}
        onPress={async () => {
          setError("");
          setIsPending(true);
          try {
            if (name.trim().length <= 3) {
              throw new Error("Name of the goal must be over 3 characters");
            }
            const userProfile = await getUserProfile();
            if (!userProfile) {
              throw new Error("User not found");
            }

            const newGoal = { name, description };
            await createGoal({ ...newGoal, userId: userProfile.id });
            router.replace("/goals");
          } catch (error) {
            if (error instanceof Error) {
              setError(error.message);
            }
          } finally {
            setIsPending(false);
          }
          setDescription("");
        }}
      >
        Set Goal
      </FormSubmitButton>
    </View>
  );
}

function ScheduleItem({
  Icon,
  iconBgColor,
  title,
  value,
}: {
  Icon: LucideIcon;
  iconBgColor: string;
  title: string;
  value: string;
}) {
  return (
    <>
      <View className="flex flex-row items-center gap-4 p-5">
        <View className={cn("rounded-xl p-2", iconBgColor)}>
          <Icon color="#fff" />
        </View>
        <View className="flex flex-1 flex-row items-center justify-between">
          <View>
            <Text
              className="text-xs text-muted-foreground"
              style={{
                fontFamily: fontFamily.openSans.semiBold,
                letterSpacing: 0.5,
              }}
            >
              {title}
            </Text>
            <Text
              style={{
                fontFamily: fontFamily.openSans.semiBold,
              }}
            >
              {value}
            </Text>
          </View>
          <ChevronRight className="text-primary" />
        </View>
      </View>
    </>
  );
}

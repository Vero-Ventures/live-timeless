import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "~/components/ui/button";
import { Text } from "~/components/ui/text";
import { useKindeAuth } from "~/lib/kinde";

export default function HomePage() {
	const { login, register, isAuthenticated } = useKindeAuth();

	useEffect(() => {
		isAuthenticated();
	});

	return (
		<SafeAreaView className="h-full">
			<View className="h-full p-4 gap-4">
				<View className="h-80">
					<Text className="text-xl font-bold">Live Timeless</Text>
				</View>
				<View className="">
					<Button onPress={login}>
						<Text>Sign In</Text>
					</Button>
				</View>
				<View>
					<Button variant="secondary" onPress={register}>
						<Text>Sign Up</Text>
					</Button>
				</View>
			</View>
		</SafeAreaView>
	);
}

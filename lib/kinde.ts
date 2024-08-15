import { KindeSDK, UserProfile } from "@kinde-oss/react-native-sdk-0-7x";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";

export const client = new KindeSDK(
	process.env.EXPO_PUBLIC_KINDE_ISSUER_URL!,
	process.env.EXPO_PUBLIC_KINDE_POST_CALLBACK_URL!,
	process.env.EXPO_PUBLIC_KINDE_CLIENT_ID!,
	process.env.EXPO_PUBLIC_KINDE_POST_LOGOUT_REDIRECT_URL!
);

export function useKindeAuth() {
	const router = useRouter();
	const [user, setUser] = useState<UserProfile | null>(null);

	useEffect(() => {
		getUserProfile()
			.then((profile) => setUser(profile))
			.catch((e: unknown) => {
				if (e instanceof Error) console.error(e.message);
			});
	}, []);

	const register = async () => {
		const token = await client.register();
		if (token) {
			router.replace("/");
		}
	};

	const login = async () => {
		const token = await client.login();
		if (token) {
			router.replace("/home");
		}
	};

	const logout = async () => {
		const loggedOut = await client.logout(true);
		if (loggedOut) {
			router.replace("/");
		}
	};

	const isAuthenticated = async () => {
		if (await client.isAuthenticated) {
			router.replace("/home");
		}
	};

	const getUserProfile = async () => {
		const userProfile = await client.getUserDetails();
		return userProfile;
	};

	return { register, login, logout, isAuthenticated, user };
}

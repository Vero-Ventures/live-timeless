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
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		async function initAuth() {
			setIsLoading(true);
			try {
				const profile = await getUserProfile();
				setUser(profile);

				const authenticated = await client.isAuthenticated;
				setIsAuthenticated(authenticated);
			} catch (e) {
				if (e instanceof Error) {
					console.error(e.message);
				}
			} finally {
				setIsLoading(false);
			}
		}
		initAuth();
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
	const getUserProfile = async () => {
		const userProfile = await client.getUserDetails();
		return userProfile;
	};

	return { register, login, logout, isAuthenticated, user, isLoading };
}

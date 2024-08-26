# Welcome to Live Timeless 👋

This is an [Expo](https://expo.dev) project for the Live Timeless app, a goal-setting and habit-tracking application.

## About the App

Live Timeless helps users set meaningful goals and develop habits to achieve them. Key features include:

- User authentication with Kinde
- Goal creation and management
- AI-powered habit plan generation
- Cross-platform compatibility (iOS, Android, and Web)

## Tech Stack

- [Expo](https://expo.dev): React Native framework
- [Convex](https://www.convex.dev/): Backend-as-a-Service
- [Kinde](https://kinde.com/): Authentication provider
- [NativeWind](https://www.nativewind.dev/): Tailwind CSS for React Native
- [Expo Router](https://docs.expo.dev/router/introduction/): File-based routing

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Set up environment variables
   
   Create a `.env` file in the root directory with the following variables:

   ```
   EXPO_PUBLIC_KINDE_ISSUER_URL=your_kinde_issuer_url
   EXPO_PUBLIC_KINDE_CLIENT_ID=your_kinde_client_id
   EXPO_PUBLIC_KINDE_REDIRECT_URI=your_kinde_redirect_uri
   EXPO_PUBLIC_KINDE_POST_LOGOUT_REDIRECT_URI=your_kinde_post_logout_redirect_uri
   EXPO_PUBLIC_CONVEX_URL=your_convex_deployment_url
   ```

   Replace the placeholder values with your actual Kinde and Convex credentials.

3. Start the app

   ```bash
    npm start
   ```

In the output, you'll find options to open the app in a:

- [Development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go)

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Project Structure

- `app/`: Main application code
- `components/`: Reusable React components
- `convex/`: Convex backend functions and schema
- `lib/`: Utility functions and constants
- `providers/`: React context providers

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
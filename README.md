# Live Timeless
This is the mobile app component for the Live Timeless platform.

## Key features
- Enables employees to take control of their personal and professional development by identifying and cultivating productive habits.
- Offers a structured and systematic approach to logging progress, helping employees stay on track and motivated.
- Delivers valuable insights into personal growth and habit patterns, enabling employees to make informed adjustments and improvements.


## Resources

- [Figma Design](https://www.figma.com/design/Uo8lKmyyGjQzIUty6RH89t/Live-Timeless---Raul-Version?node-id=5-13450&t=F6wqbjoMY7NHUa7W-0)
- [Concept Document](https://docs.google.com/document/d/1OxHxL4G9lwTwSLeegsMo6ROS_LrOjwFMnz12L6zyV5E/edit#heading=h.yx6bzclsmjey)
- [Design Document](https://docs.google.com/document/d/1HXuIfBiUZFNLrclgBFoOvKhhSuzqUeZw0Kejc0UloGI/edit#heading=h.l55oku9vy9nf)

## Tech Stack

- [Expo](https://expo.dev): React Native framework
- [Convex](https://www.convex.dev/): Backend-as-a-Service
- [NativeWind](https://www.nativewind.dev/): Tailwind CSS for React Native
- [Expo Router](https://docs.expo.dev/router/introduction/): File-based routing

## Get Started

1. **Install dependencies**

   ```bash
   npm install expo
   ```
   ```bash
   npx expo install
   ```

> [!NOTE]  
> Unlike the web, React Native is not backwards compatible. This means that npm packages often need to be the exact right version for the currently installed copy of react-native in your project. Expo CLI provides a best-effort tool for doing this using a list of popular packages and the known working version combinations. Simply use the `expo install` command as a drop-in replacement for `npm install`.

2. **Set up environment variables**

   Copy over the `.env.example` and name it `.env.local`. Replace the placeholder values with your actual values.

> [!NOTE]   
> The `npx convex dev` command will automatically generate your env variables for Convex so you won't have to manually enter it.

3. **Log in to Convex**

   Visit [Convex](https://www.convex.dev/login) and log in with GitHub using our shared account: `admin@veroventures.com`.

4. **Log in to the Convex CLI**

   ```bash
   npx convex login
   ```

5. **Run the Convex dev server**

   ```bash
   npx convex dev
   ```

6. **Install a Development Build**

   For running the app on your device, you will need to install a [development build](https://docs.expo.dev/develop/development-builds/introduction/). Follow the instructions below to get a development build set up for your device.

   ### Android

      1. Go to the [development builds page](https://expo.dev/accounts/live-timeless/projects/live-timeless-app/development-builds) on the Expo Dashboard on your phone.
      2. Look for the latest Android internal distribution build (profile should say Development).
      3. Click install to install the APK on your device.

   ### iOS

      #### Prerequisites
   
      Before we begin, ensure you have:
      - **Developer Mode activated on iOS 16 or higher**: Installing development builds on your device requires Developer Mode to be enabled. If this is your first time or if it's currently disabled, see these instructions to [activate Developer Mode](https://docs.expo.dev/guides/ios-developer-mode/).

   
   1. Contact your team admin and have them create and install provisioning profile. Refer to the [documentation](https://docs.expo.dev/tutorial/eas/ios-development-build-for-devices/#register-an-ios-device). 
      ```
      eas device:create
      ```
   2. Ask a team admin with apple developer account access to create a development build. Refer to the [documentation](https://docs.expo.dev/tutorial/eas/ios-development-build-for-devices/#development-build-for-ios-device) for more information.

      ```bash
      eas build --platform ios --profile development
      ```

> [!IMPORTANT]  
> Make sure your device is selected in the Provisioning Profile.

   3. Go to the [development builds page](https://expo.dev/accounts/live-timeless/projects/live-timeless-app/development-builds) on the Expo Dashboard on your phone.
   4. Look for the latest iOS internal distribution build (profile should say Development).
   5. Click install to install the IPA on your device.

7. **Start the development server**

   After you have installed the development build, you can start the development server by running:

   ```bash
   npm start
   ```

8. **Sign in to the app**

   Click on the Live Timeless app and log in with your Expo account by clicking on the user profile icon on the top right. Then close the app and open it again.

## Contributing
You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Project Structure

- `app/`: Main application code
- `components/`: Reusable React components
- `convex/`: Convex backend functions and schema
- `lib/`: Utility functions and constants
- `providers/`: React context providers

### Workflow

1. Create a new branch for each task, feature and bug fix
2. Write clean, well-commented code
3. Test your changes thoroughly
4. Create a pull request for code review before merging

### Deployment

- We use EAS (Expo Application Services) for building and deploying the app
- Familiarize yourself with the `eas.json` configuration file

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.


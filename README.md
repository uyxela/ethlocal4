# Globy

![image](https://github.com/user-attachments/assets/23e9baf8-178b-4e74-a422-458e83191017)

Meet Globy: the newest addition to the ETHGlobal team, joining all your adventures around the world, online, and on-chain!

Globy lets you quickly see what’s next on your packed schedule and keeps you in the loop so you don't miss out on any cool updates with in-app notifications.

Globy was designed to supercharge your event experience, enabling you to:
- [x] Build your own schedule plan your meals, workshops and side-events
- [x] Easily access your tickets directly from your phone
- [x] See all of your packs from within the app and redeem perks with ease

### How it's made

Globy is a TypeScript React Native app that leverages native modules through Expo.

Frameworks used include Nativewind, which enables Tailwind utilities and configuration in React Native, Apollo Client for GraphQL, and several Expo libraries including but not limited to Expo Notifications, Expo Router, Expo Secure Store, and Expo Task Manager.

The app interfaces with a modified version of the ETHGlobal API (https://api.ethglobal.com). Some endpoints have been modified and many added to enable functionality such as custom schedules and notifications. For convenience, the app connects to the adapted server through a public Ngrok URL. 

In order to prevent any schema changes to existing database deployments, a new Postgres database was deployed on GCP. A lightweight server was spun up to act as a wrapper around actions involving the new database, such as composing custom schedules, saving device tokens to users in order to send push notifications remotely, and tracking notification data.

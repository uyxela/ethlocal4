import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { client } from "@/app/_layout";
import { gql } from "@apollo/client";
import * as TaskManager from "expo-task-manager";

const BACKGROUND_NOTIFICATION_TASK = "BACKGROUND-NOTIFICATION-TASK";

TaskManager.defineTask(
  BACKGROUND_NOTIFICATION_TASK,
  ({ data, executionInfo }) => {
    console.log("Received a notification in the background!");
    console.log(data, executionInfo);
    // Do something with the notification data
  }
);

Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const NotificationsContext = createContext<{
  register: () => void;
  unregister: () => void;
  dismiss: () => void;
  notificationsEnabled: () => Promise<boolean>;
}>({
  register: () => null,
  unregister: () => null,
  dismiss: () => null,
  notificationsEnabled: () => Promise.resolve(false),
});

export function useNotifications() {
  const value = useContext(NotificationsContext);
  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }

  return value;
}

async function register() {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    // EAS projectId is used here.
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;

      await client.mutate({
        mutation: gql`
          mutation registerPushToken($token: String!) {
            registerPushToken(token: $token)
          }
        `,
        variables: {
          token,
        },
      });
    } catch (e) {
      console.error(e);
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }
}

async function unregister() {
  if (Device.isDevice) {
    try {
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        throw new Error("Project ID not found");
      }
      const token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;

      await client.mutate({
        mutation: gql`
          mutation unregisterPushToken($token: String!) {
            unregisterPushToken(token: $token)
          }
        `,
        variables: {
          token,
        },
      });
    } catch (e) {
      console.error(e);
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }
}

export function NotificationsProvider({ children }: PropsWithChildren) {
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        register,
        unregister,
        dismiss: async () => {
          await Notifications.dismissAllNotificationsAsync();
          await Notifications.setBadgeCountAsync(0);
        },
        notificationsEnabled: async () => {
          const { status: existingStatus } =
            await Notifications.getPermissionsAsync();

          return existingStatus === "granted";
        },
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

import Background from "@/components/Background";
import { ThemedText } from "@/components/ThemedText";
import React, { useEffect } from "react";
import { Pressable, SafeAreaView, ScrollView, View } from "react-native";
import Mail from "@/assets/images/mail.svg";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { gql, useQuery } from "@apollo/client";
import Loading from "@/components/Loading";
import moment from "moment";
import { getReadableTimeDifference } from "@/utils/misc";
import { useNotifications } from "@/hooks/useNotifications";
import { client } from "@/app/_layout";

export default function NotificationsScreen() {
  const router = useRouter();
  const { dismiss } = useNotifications();

  const { data: notificationsData, loading } = useQuery(gql`
    query getNotificationsSelf {
      getNotificationsSelf {
        id
        title
        body
        sentAt
        readAt
      }
    }
  `);

  useEffect(() => {
    void dismiss();

    if (notificationsData?.getNotificationsSelf) {
      void client.mutate({
        mutation: gql`
          mutation markNotificationsRead($ids: String!) {
            markNotificationsRead(ids: $ids)
          }
        `,
        variables: {
          ids: notificationsData.getNotificationsSelf
            .filter((notification: any) => !notification.readAt)
            .map((notification: any) => notification.id)
            .join(","),
        },
      });
    }
  }, [notificationsData]);

  if (loading) {
    return <Loading />;
  }

  const notifications = Array.from(notificationsData.getNotificationsSelf).sort(
    (a: any, b: any) => moment(b.sentAt).diff(moment(a.sentAt))
  );

  const newNotifications = notifications.filter(
    (notification: any) => !notification.readAt
  );
  const seenNotifications = notifications.filter(
    (notification: any) => notification.readAt
  );

  return (
    <View className="w-full h-full">
      <Background />
      <SafeAreaView>
        <ScrollView>
          <View className="flex flex-col justify-start items-center w-full h-full pb-36">
            <View className="w-[80%] flex flex-row justify-start items-center">
              <Pressable
                className="pt-8 pb-4 pl-1 pr-8"
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={30} color="black" />
              </Pressable>
            </View>
            <Mail width={100} height={100} />
            <ThemedText className="text-4xl mt-6" weight="semibold">
              Notifications
            </ThemedText>

            <View className="flex flex-col w-[70%] justify-start items-start">
              <ThemedText className="text-3xl mt-6" weight="semibold">
                New
              </ThemedText>
              {newNotifications.length === 0 && (
                <View>
                  <ThemedText className="text-xl mt-2">
                    No new notifications
                  </ThemedText>
                </View>
              )}
              {newNotifications.map((notification: any) => (
                <View
                  key={notification.id}
                  className="w-full flex flex-row justify-between items-start py-2"
                >
                  <View>
                    <ThemedText className="text-lg" weight="semibold">
                      {notification.title}
                    </ThemedText>
                    <ThemedText className="text-sm" color="gray">
                      {notification.body}
                    </ThemedText>
                  </View>

                  <ThemedText>
                    {getReadableTimeDifference(
                      moment(notification.sentAt),
                      moment()
                    )}{" "}
                    ago
                  </ThemedText>
                </View>
              ))}

              <ThemedText className="text-3xl mt-6" weight="semibold">
                Seen
              </ThemedText>

              {seenNotifications.length === 0 && (
                <View>
                  <ThemedText className="text-xl mt-2">
                    No seen notifications
                  </ThemedText>
                </View>
              )}

              {seenNotifications.map((notification: any) => (
                <View
                  key={notification.id}
                  className="w-full flex flex-row justify-between items-start py-2"
                >
                  <View>
                    <ThemedText className="text-lg" weight="semibold">
                      {notification.title}
                    </ThemedText>
                    <ThemedText className="text-sm" color="gray">
                      {notification.body}
                    </ThemedText>
                  </View>

                  <ThemedText>
                    {getReadableTimeDifference(
                      moment(notification.sentAt),
                      moment()
                    )}{" "}
                    ago
                  </ThemedText>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

import Background from "@/components/Background";
import Loading from "@/components/Loading";
import { ThemedText } from "@/components/ThemedText";
import { gql, useQuery } from "@apollo/client";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, SafeAreaView, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useNotifications } from "@/hooks/useNotifications";
import { deleteItemAsync } from "expo-secure-store";
import { client } from "@/app/_layout";

export default function ProfileScreen() {
  const router = useRouter();
  const { register, unregister, notificationsEnabled } = useNotifications();

  const [areNotificationsEnabled, setAreNotificationsEnabled] = useState(false);

  const { data: userData, loading: userDataLoading } = useQuery(gql`
    query getUserSelf {
      getUserSelf {
        id
        name
        email
        bio
        avatar {
          fullUrl
        }
      }
    }
  `);

  useEffect(() => {
    async function checkNotifications() {
      const enabled = await notificationsEnabled();
      setAreNotificationsEnabled(enabled);
    }

    void checkNotifications();
  }, [notificationsEnabled]);

  if (userDataLoading) {
    return <Loading />;
  }

  const user = userData.getUserSelf;

  return (
    <View className="w-full h-full">
      <Background />
      <SafeAreaView>
        <View className="flex flex-col justify-between items-center w-full mt-28">
          <Image
            style={{
              width: 160,
              height: 160,
              borderRadius: 9999,
              borderWidth: 2,
              borderColor: "#111827",
            }}
            source={user.avatar.fullUrl}
          />
          <ThemedText className="text-4xl mt-12 mb-2" weight="semibold">
            {user.name}
          </ThemedText>
          <ThemedText className="text-xl">{user.email}</ThemedText>

          <View className="flex flex-col justify-start items-center w-[60%] mt-16">
            <Pressable onPress={() => router.navigate("/profile/schedule")}>
              <View className="flex flex-row w-full justify-between items-center py-5 border-y-2 px-4 border-gray-900">
                <ThemedText className="text-2xl" weight="medium">
                  My Schedule
                </ThemedText>
                <Feather name="arrow-up-right" size={24} color="black" />
              </View>
            </Pressable>

            <Pressable
              onPress={async () => {
                console.log("registering");
                await register();
              }}
            >
              <View className="flex flex-row w-full justify-between items-center py-5 border-b-2 px-4 border-gray-900">
                <ThemedText className="text-2xl" weight="medium">
                  Notifications
                </ThemedText>
                {areNotificationsEnabled ? (
                  <Ionicons
                    name="notifications-outline"
                    size={24}
                    color="black"
                  />
                ) : (
                  <Ionicons
                    name="notifications-off-outline"
                    size={24}
                    color="black"
                  />
                )}
              </View>
            </Pressable>
            <Pressable
              onPress={async () => {
                await deleteItemAsync("token");
                await unregister();
                await client.clearStore();
                router.replace("/");
              }}
            >
              <View className="flex flex-row w-full justify-between items-center py-5 border-b-2 px-4 border-gray-900">
                <ThemedText className="text-2xl" weight="medium">
                  Sign Out
                </ThemedText>
                <Feather name="arrow-down-left" size={24} color="black" />
              </View>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";
import Background from "@/components/Background";
import { gql, useQuery } from "@apollo/client";
import Loading from "@/components/Loading";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import { useRouter } from "expo-router";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { ScheduleItem } from "../events/schedules";
import { getLoginToken } from "@/utils/misc";
import { openBrowserAsync } from "expo-web-browser";

export default function HomeScreen() {
  const router = useRouter();

  const { data: userData, loading: userDataLoading } = useQuery(gql`
    query getUserSelf {
      getUserSelf {
        id
        firstName
        name
        email
        bio
        avatar {
          fullUrl
        }
      }
    }
  `);

  const { data: packsData, loading: packsLoading } = useQuery(gql`
    query getPacksSelf {
      getPacksSelf {
        slug
        name
        image
      }
    }
  `);

  const { data: attendeeData, loading: attendeeLoading } = useQuery(gql`
    query {
      getAttendeeSelf {
        id
        slug
        name
        type
        startTime
        endTime
        status
        squareLogo {
          id
          name
          path
        }
        squareLogoFullUrl
      }
    }
  `);

  const user = !userDataLoading && userData.getUserSelf;
  const packs = !packsLoading && packsData.getPacksSelf;
  const events = !attendeeLoading && attendeeData.getAttendeeSelf;

  const currentEvent =
    events?.find &&
    events.find((event: any) =>
      moment().isBetween(
        moment(event.startTime.substring(0, 10)),
        moment(event.endTime.substring(0, 10)).set({ hour: 23, minute: 59 })
      )
    );

  const { data: notifications } = useQuery(gql`
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

  const { data: scheduleData, loading: scheduleLoading } = useQuery(
    gql`
      query getSchedulesByEventSlug($eventSlug: String!) {
        getSchedulesByEventSlug(eventSlug: $eventSlug) {
          id
          uuid
          slug
          name
          abstract
          description
          startTime
          length
          type
          status
          published
          videoId
          meta
          isStarred
          event {
            name
            slug
            squareLogo {
              fullUrl
            }
            parentEvent {
              type
            }
          }
          speakers {
            id
            user {
              uuid
              id
              bio
              organization {
                name
              }
              avatar {
                fullUrl
              }
              name
              title
              twitter
            }
          }
          location {
            name
          }
          organization {
            name
            squareLogo {
              fullUrl
            }
          }
        }
      }
    `,
    {
      variables: {
        eventSlug: currentEvent?.slug,
        disabled: !currentEvent,
      },
    }
  );

  if (userDataLoading || packsLoading || attendeeLoading || scheduleLoading) {
    return <Loading />;
  }

  const nextScheduleItem = scheduleData?.getSchedulesByEventSlug.find(
    (scheduleItem: any) =>
      moment().isBefore(
        moment(scheduleItem.startTime).add(
          moment.duration(scheduleItem.length, "minutes")
        )
      )
  );

  const hasUnreadNotifications = notifications?.getNotificationsSelf?.some(
    (notification: any) => !notification.readAt
  );

  return (
    <View className="w-full h-full">
      <Background />
      <SafeAreaView>
        <ScrollView>
          <View className="flex flex-col justify-start items-center w-full h-full pb-36">
            <View className="w-[80%] flex flex-row justify-between items-center">
              <Pressable
                className="py-8 pl-1 pr-8"
                onPress={async () => {
                  const token = await getLoginToken();
                  await openBrowserAsync(
                    `http://ethglobal.com/auth?signature=${token}&redirect=/connect`
                  );
                }}
              >
                <MaterialCommunityIcons
                  name="cellphone-nfc"
                  size={28}
                  color="black"
                />
              </Pressable>

              <Pressable
                className="py-8 pl-8 pr-1"
                onPress={() => router.navigate("home/notifications")}
              >
                {hasUnreadNotifications && (
                  <View
                    style={{
                      position: "absolute",
                      top: 24,
                      right: -2,
                      height: 10,
                      width: 10,
                      backgroundColor: "red",
                      borderRadius: 9999,
                    }}
                  />
                )}
                <AntDesign name="notification" size={28} color="black" />
              </Pressable>
            </View>
            <View className="w-[80%] flex flex-col gap-8">
              <Pressable
                onPress={() => router.navigate("packs")}
                className="h-60 w-full py-12 px-10 flex flex-col justify-around items-start rounded-xl overflow-hidden"
              >
                <LinearGradient
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    top: 0,
                    height: 240,
                    width: 360,
                  }}
                  colors={["#1d1238", "#2a0000", "#061411"]}
                  locations={[0.4, 0.7, 1]}
                  start={{ x: 0.9, y: 0 }}
                  end={{ x: 0, y: 0.3 }}
                />
                <ThemedText className="text-3xl" weight="medium" color="white">
                  Great to see you, {user.firstName}!
                </ThemedText>

                <View className="flex flex-row flex-wrap max-h-full gap-2">
                  {packs.map((pack: any, index: number) => (
                    <View
                      key={index}
                      className="border-2 border-white rounded-full px-2 py-0.5"
                    >
                      <ThemedText color="white" weight="medium">
                        {pack.name}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              </Pressable>

              {currentEvent && (
                <View className="flex flex-col justify-start items-start gap-4">
                  <ThemedText className="text-3xl mt-4" weight="bold">
                    Welcome to {currentEvent.name}!
                  </ThemedText>

                  <Pressable
                    onPress={() =>
                      router.navigate({
                        pathname: "events/ticket",
                        params: {
                          name: currentEvent.name,
                          slug: currentEvent.slug,
                        },
                      })
                    }
                  >
                    <View className="border-2 py-2.5 px-4 flex flex-row justify-between items-center w-full bg-violet-100">
                      <ThemedText className="text-2xl" weight="semibold">
                        View your ticket
                      </ThemedText>
                      <Feather name="arrow-up-right" size={24} color="black" />
                    </View>
                  </Pressable>

                  {nextScheduleItem && (
                    <View className="border-b-2 border-gray-900 pb-4">
                      <ThemedText
                        className="text-2xl mt-6 mb-4"
                        weight="semibold"
                      >
                        Next Up
                      </ThemedText>
                      <ScheduleItem scheduleItem={nextScheduleItem} />
                    </View>
                  )}

                  <Pressable
                    onPress={() => router.navigate("profile/schedule")}
                  >
                    <View className="border-2 py-2.5 px-4 flex flex-row justify-between items-center mt-6 w-full bg-green-100">
                      <ThemedText className="text-2xl" weight="semibold">
                        View my schedule
                      </ThemedText>
                      <Feather name="arrow-up-right" size={24} color="black" />
                    </View>
                  </Pressable>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

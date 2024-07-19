import Background from "@/components/Background";
import {
  View,
  SafeAreaView,
  ScrollView,
  Pressable,
  Switch,
} from "react-native";
import Speaker from "@/assets/images/speaker.svg";
import { ThemedText } from "@/components/ThemedText";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { gql, useMutation, useQuery } from "@apollo/client";
import Loading from "@/components/Loading";
import moment from "moment";
import { Image } from "expo-image";

import Flag from "@/assets/images/flag.svg";
import Burger from "@/assets/images/burger.svg";
import Triangle from "@/assets/images/triangle.svg";
import { getCdnUrl } from "@/utils/misc";
import { useState } from "react";

export function ScheduleItem({ scheduleItem }: { scheduleItem: any }) {
  const router = useRouter();
  const [starred, setStarred] = useState(scheduleItem.isStarred);

  const [toggleStar] = useMutation(
    gql`
      mutation toggleStar($id: Float!) {
        toggleStar(id: $id)
      }
    `,
    {
      variables: {
        id: scheduleItem.id,
      },
      refetchQueries: ["getSchedulesByEventSlug"],
    }
  );

  return (
    <View className="w-full border-t-2 border-gray-900 pt-4 px-2 flex flex-row justify-between items-center">
      <Pressable
        className="flex flex-col"
        onPress={() =>
          router.navigate(`/events/schedules/${scheduleItem.slug}`)
        }
      >
        <ThemedText color="#6B7280">
          {moment(scheduleItem.startTime).format("h:mm A MMM D")}
        </ThemedText>
        <View className="flex flex-row max-w-72 justify-start items-center gap-2">
          {scheduleItem.type === "notification" && (
            <Flag width={12} height={12} color="black" />
          )}
          {scheduleItem.type === "meal" && (
            <Burger width={12} height={12} color="black" />
          )}
          <ThemedText className="text-xl" weight="medium">
            {scheduleItem.name}
          </ThemedText>
        </View>
        {/* Tags */}
        <View
          style={{ alignSelf: "flex-start" }}
          className="flex flex-row justify-start items-center gap-1"
        >
          {/* Location */}
          {scheduleItem.location && (
            <View
              style={{ alignSelf: "flex-start" }}
              className="flex flex-row items-center gap-2 border-2 border-gray-200 rounded-lg px-1 py-0.5 bg-white"
            >
              <Triangle width={12} height={12} color="#6b7280" />
              <ThemedText color="#6b7280">
                {scheduleItem.location.name}
              </ThemedText>
            </View>
          )}
          {/* Host */}
          {scheduleItem.speakers?.length > 0 && (
            <View
              style={{ alignSelf: "flex-start" }}
              className="flex flex-row items-center gap-2 border-2 border-gray-200 rounded-lg px-1 py-0.5 bg-white"
            >
              <Image
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 9999,
                }}
                source={getCdnUrl(
                  "users",
                  scheduleItem.speakers[0].user.uuid,
                  "xs"
                )}
              />
              <ThemedText color="#6b7280">
                {scheduleItem.speakers[0].user.name}
              </ThemedText>
            </View>
          )}
        </View>
      </Pressable>
      <Pressable
        onPress={() => {
          setStarred(!starred);
          void toggleStar();
        }}
        className="flex flex-1 flex-row justify-end items-center"
      >
        <AntDesign name={starred ? "star" : "staro"} size={20} color="black" />
      </Pressable>
    </View>
  );
}

export default function SchedulePage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  const [showCurrent, setShowCurrent] = useState(true);
  const [showStarred, setShowStarred] = useState(false);

  const { data: scheduleData, loading } = useQuery(
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
        eventSlug: slug,
      },
    }
  );

  if (loading) {
    return <Loading />;
  }

  const scheduleItems = scheduleData.getSchedulesByEventSlug ?? [];

  const filteredScheduleItems = scheduleItems.filter(
    (scheduleItem: any) =>
      (!showStarred || (showStarred && scheduleItem.isStarred)) &&
      (!showCurrent ||
        (showCurrent &&
          moment().isBefore(
            moment(scheduleItem.startTime).add(
              moment.duration(scheduleItem.length, "minutes")
            )
          )))
  );

  return (
    <View className="w-full h-full">
      <Background />
      <SafeAreaView>
        <View className="flex flex-row justify-start items-center w-full px-8 pt-2 pb-4">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={30} color="black" />
          </Pressable>
        </View>
        <ScrollView>
          <View className="flex flex-col justify-start items-center w-full h-full py-4 pb-52">
            <Speaker width={100} height={100} />
            <ThemedText className="text-4xl mt-6" weight="semibold">
              Schedule
            </ThemedText>

            {/* Controls */}
            <View className="flex flex-row justify-center items-start gap-4 mt-4">
              <View className="flex flex-col justify-center items-center border-r-2 border-gray-900 pr-8">
                <ThemedText weight="medium">CURRENT</ThemedText>
                <Switch
                  value={showCurrent}
                  onValueChange={setShowCurrent}
                  trackColor={{ false: "#9ca3af", true: "#a78bfa" }}
                  style={{
                    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                  }}
                />
              </View>
              <View className="flex flex-col justify-center items-center border-gray-900 pl-4">
                <ThemedText weight="medium">STARRED</ThemedText>
                <Switch
                  value={showStarred}
                  onValueChange={setShowStarred}
                  trackColor={{ false: "#9ca3af", true: "#a78bfa" }}
                  style={{
                    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                  }}
                />
              </View>
            </View>

            <View className="flex flex-col justify-start items-center w-[80%] gap-4 mt-6 pb-4 border-b-2 border-gray-900">
              {!showCurrent &&
                !showStarred &&
                scheduleItems.map((scheduleItem: any, index: number) => (
                  <ScheduleItem key={index} scheduleItem={scheduleItem} />
                ))}

              {showCurrent &&
                showStarred &&
                filteredScheduleItems.map(
                  (scheduleItem: any, index: number) => (
                    <ScheduleItem key={index} scheduleItem={scheduleItem} />
                  )
                )}

              {showCurrent &&
                !showStarred &&
                filteredScheduleItems.map(
                  (scheduleItem: any, index: number) => (
                    <ScheduleItem key={index} scheduleItem={scheduleItem} />
                  )
                )}

              {!showCurrent &&
                showStarred &&
                filteredScheduleItems.map(
                  (scheduleItem: any, index: number) => (
                    <ScheduleItem key={index} scheduleItem={scheduleItem} />
                  )
                )}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

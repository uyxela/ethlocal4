import Background from "@/components/Background";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  Switch,
  View,
} from "react-native";
import { ScheduleItem } from "../events/schedules";

import MagnifyingGlass from "@/assets/images/magnifying-glass.svg";
import { gql, useQuery } from "@apollo/client";
import Loading from "@/components/Loading";
import moment from "moment";

export default function ScheduleScreen() {
  const [showCurrent, setShowCurrent] = useState(true);
  const [showStarred, setShowStarred] = useState(false);

  const { data: scheduleData, loading } = useQuery(gql`
    query getSchedule {
      getUserSchedules {
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
      }
    }
  `);

  if (loading) {
    return <Loading />;
  }

  const scheduleItems = scheduleData.getUserSchedules ?? [];

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
            <MagnifyingGlass width={100} height={100} />
            <ThemedText className="text-4xl mt-6" weight="semibold">
              My Schedule
            </ThemedText>

            {/* Controls */}
            <View className="flex flex-row justify-center items-start gap-4 mt-4">
              <View className="flex flex-row justify-center items-center gap-2 mt-6">
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

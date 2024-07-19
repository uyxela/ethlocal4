import Background from "@/components/Background";
import Loading from "@/components/Loading";
import { ThemedText } from "@/components/ThemedText";
import { gql, useQuery } from "@apollo/client";
import { Pressable, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Globe from "@/assets/images/globe.svg";
import Tag from "@/components/Tag";
import moment from "moment";
import {
  eventAttributes,
  getEventColour,
  getEventTypeString,
} from "@/utils/misc";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";

type Event = {
  id: string;
  slug: string;
  name: string;
  type: string;
  startTime: string;
  endTime: string;
  status: string;
  squareLogo: {
    id: string;
    name: string;
    path: string;
  };
  squareLogoFullUrl: string;
};

function EventCard({ event }: { event: Event }) {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.navigate(`/events/${event.slug}`)}>
      <View className="flex flex-col w-full">
        <View className="border-2 border-gray-900 border-b-0 rounded-t-lg p-6 bg-white">
          <View>
            <Tag
              text={getEventTypeString(event).toUpperCase()}
              color={getEventColour(eventAttributes(event))}
            />
          </View>
          <View className="flex flex-row justify-between items-center w-full">
            <ThemedText className="text-2xl" weight="semibold">
              {event.name}
            </ThemedText>
            <Image
              style={{
                width: 50,
                height: 50,
                borderRadius: 9999,
                borderColor: "#111827",
                borderWidth: 2,
              }}
              source={event.squareLogoFullUrl}
            />
          </View>
          <View
            style={{
              alignSelf: "flex-start",
            }}
            className="border-2 rounded-md flex justify-center items-center px-2 py-0.5"
          >
            <ThemedText weight="medium">
              {event.startTime} → {event.endTime}
            </ThemedText>
          </View>
        </View>
        <View className="border-2 border-gray-900 rounded-b-lg bg-[#FAE5C3] px-6 py-3">
          <View className="flex flex-row w-full justify-between items-center">
            <ThemedText weight="semibold">Explore Event</ThemedText>
            <Feather name="arrow-up-right" size={16} color="black" />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function EventsScreen() {
  const router = useRouter();
  const { ticket, name, slug } = useLocalSearchParams<{
    ticket: string;
    name: string;
    slug: string;
  }>();

  const { data, loading } = useQuery(gql`
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

  if (loading) {
    return <Loading />;
  }

  const currentEvents: Event[] =
    data.getAttendeeSelf
      ?.filter((event: Event) => event.status !== "finished")
      .sort((eventA: Event, eventB: Event) =>
        moment(eventA.endTime).isAfter(moment(eventB.endTime)) ? 1 : -1
      )
      .map((event: Event) => ({
        ...event,
        startTime: moment(event.startTime.substring(0, 10)).format(
          "MMM D, YYYY"
        ),
        endTime: moment(event.endTime.substring(0, 10)).format("MMM D, YYYY"),
      })) ?? [];

  return (
    <View className="w-full h-full">
      <Background />
      <SafeAreaView>
        <ScrollView>
          <View className="flex flex-col justify-start items-center w-full h-full py-4 pb-36">
            <Globe style={{ marginTop: 10 }} width={120} height={120} />
            <ThemedText className="text-5xl mt-6" weight="semibold">
              My Events
            </ThemedText>
            <View className="flex flex-col justify-start items-center w-[80%] gap-4 mt-6">
              {currentEvents.map((event: Event, index: number) => (
                <EventCard key={index} event={event} />
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

// (event1: IRoleEvent, event2: IRoleEvent) => {
// return moment(event1.endTime).isAfter(moment(event2.endTime)) ? 1 : -1
// }

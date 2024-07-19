import Background from "@/components/Background";
import Loading from "@/components/Loading";
import { ThemedText } from "@/components/ThemedText";
import { gql, useQuery } from "@apollo/client";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, SafeAreaView, ScrollView, View } from "react-native";
import { Image } from "expo-image";
import { Feather, Ionicons } from "@expo/vector-icons";
import { getLoginToken } from "@/utils/misc";
import { openBrowserAsync } from "expo-web-browser";

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
  venueLocation: {
    name: string;
    address: string;
  };
  venueFloorplans: [
    {
      file: {
        fullUrl: string;
      };
    }
  ];
};

export default function EventScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  const { data: eventData, loading: eventDataLoading } = useQuery(
    gql`
      query getEventBySlug($slug: String!) {
        getEventBySlug(slug: $slug) {
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
          venueLocation {
            name
            address
          }
          venueFloorplans {
            file {
              fullUrl
            }
          }
        }
      }
    `,
    {
      variables: {
        slug,
      },
    }
  );

  if (eventDataLoading) {
    return <Loading />;
  }

  const event = eventData.getEventBySlug as Event;

  return (
    <View className="w-full h-full">
      <Background />
      <SafeAreaView>
        {/* <ScrollView> */}
        <View className="flex flex-col justify-start items-center w-full h-full t-4">
          <View className="flex flex-row justify-start items-center w-full px-8 pt-2 pb-4">
            <Pressable onPress={() => router.navigate("/events")}>
              <Ionicons name="arrow-back" size={30} color="black" />
            </Pressable>
          </View>
          <Image
            style={{
              width: 120,
              height: 120,
              borderRadius: 9999,
              borderColor: "#111827",
              borderWidth: 2,
            }}
            source={event.squareLogoFullUrl}
          />
          <ThemedText className="text-4xl text-center mt-4" weight="semibold">
            {event.name}
          </ThemedText>

          <View>
            <ThemedText className="text-lg">
              {event.venueLocation.address}
            </ThemedText>
          </View>

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/events/ticket",
                params: {
                  name: event.name,
                  slug,
                },
              })
            }
          >
            <View className="border-2 py-2.5 px-4 flex flex-row justify-between items-center mt-4 w-[70%] bg-violet-100">
              <ThemedText className="text-2xl" weight="semibold">
                View your ticket
              </ThemedText>
              <Feather name="arrow-up-right" size={24} color="black" />
            </View>
          </Pressable>

          {event.venueFloorplans.at(0)?.file?.fullUrl && (
            <View className="flex mt-6 mb-4 flex-col justify-start items-start gap-2">
              <ThemedText className="text-2xl" weight="semibold">
                Venue Map
              </ThemedText>
              <Image
                style={{
                  width: 300,
                  height: 200,
                }}
                source={event.venueFloorplans[0].file.fullUrl}
              />
            </View>
          )}

          <Pressable
            onPress={() =>
              router.push({
                pathname: "/events/schedules",
                params: {
                  name: event.name,
                  slug,
                },
              })
            }
          >
            <View className="border-2 py-2.5 px-4 flex flex-row justify-between items-center mt-4 w-[70%] bg-green-100">
              <ThemedText className="text-2xl" weight="semibold">
                View schedule
              </ThemedText>
              <Feather name="arrow-up-right" size={24} color="black" />
            </View>
          </Pressable>

          <Pressable
            onPress={async () => {
              const token = await getLoginToken();
              await openBrowserAsync(
                `http://ethglobal.com/auth?signature=${token}&redirect=/events/${slug}/info`
              );
            }}
          >
            <View className="border-2 py-2.5 px-4 flex flex-row justify-between items-center mt-4 w-[70%] bg-orange-100">
              <ThemedText className="text-2xl" weight="semibold">
                View event info
              </ThemedText>
              <Feather name="arrow-up-right" size={24} color="black" />
            </View>
          </Pressable>
        </View>
        {/* </ScrollView> */}
      </SafeAreaView>
    </View>
  );
}

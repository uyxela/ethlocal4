import Background from "@/components/Background";
import Loading from "@/components/Loading";
import { ThemedText } from "@/components/ThemedText";
import { gql, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View, SafeAreaView, Pressable, Dimensions } from "react-native";
import PassKit, { AddPassButton } from "react-native-passkit-wallet";
import Pdf from "react-native-pdf";

export default function TicketModal() {
  const { name, slug } = useLocalSearchParams<{ name: string; slug: string }>();
  const router = useRouter();

  const [passKitEnabled, setPassKitEnabled] = useState(false);
  const [passKitLoaded, setPassKitLoaded] = useState(false);

  const [pdfLoaded, setPdfLoaded] = useState(false);

  const { data: ticketData, loading: ticketLoading } = useQuery(
    gql`
      query getHackerSelfByEventSlug($eventSlug: String!) {
        getHackerSelfByEventSlug(eventSlug: $eventSlug) {
          ticket {
            fullUrl
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

  useEffect(() => {
    async function loadPassKit() {
      const canAddPasses = await PassKit.canAddPasses();
      setPassKitEnabled(canAddPasses);
      setPassKitLoaded(true);
    }

    void loadPassKit();
  }, []);

  useEffect(() => {
    if (!slug) {
      router.navigate("/events");
    }
  }, [slug]);

  if (!passKitLoaded || ticketLoading) {
    return <Loading />;
  }

  return (
    <View className="w-full h-full">
      <Background />
      <SafeAreaView>
        <View className="flex flex-col justify-start items-center w-full h-full py-4">
          <View className="flex flex-row justify-start items-center w-full px-5">
            <Pressable
              onPress={() => router.back()}
              className="w-1/6 flex justify-center items-start"
            >
              <Ionicons name="close" size={30} color="black" />
            </Pressable>
            <View className="w-2/3 flex justify-center items-center">
              <ThemedText className="text-xl text-center" weight="medium">
                Your {name} ticket
              </ThemedText>
            </View>
          </View>

          {ticketData.getHackerSelfByEventSlug?.ticket?.fullUrl && (
            <Pdf
              fitPolicy={0}
              style={{
                marginTop: 10,
                marginBottom: 20,
                height: Dimensions.get("window").height - 300,
                width: Dimensions.get("window").width,
              }}
              source={{
                uri: ticketData.getHackerSelfByEventSlug.ticket.fullUrl,
              }}
              onLoadComplete={() => setPdfLoaded(true)}
            />
          )}

          {passKitEnabled && (
            <AddPassButton
              style={{
                width: 120,
                height: 40,
              }}
              addPassButtonStyle={(PassKit as any).AddPassButtonStyle.black}
              onPress={() => {
                PassKit.addPass("");
              }}
            />
          )}
        </View>
      </SafeAreaView>
    </View>
  );
}

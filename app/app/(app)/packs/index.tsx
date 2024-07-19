import Background from "@/components/Background";
import { ThemedText } from "@/components/ThemedText";
import React from "react";
import { Pressable, SafeAreaView, ScrollView, View } from "react-native";

import Climb from "@/assets/images/climb.svg";
import { router, useRouter } from "expo-router";
import { gql, useQuery } from "@apollo/client";
import Loading from "@/components/Loading";
import { Image } from "expo-image";
import { Feather } from "@expo/vector-icons";
import { openBrowserAsync } from "expo-web-browser";
import { getLoginToken } from "@/utils/misc";

function PackCard({ pack }: { pack: any }) {
  return (
    <Pressable
      onPress={async () => {
        // router.navigate(`/packs/${pack.slug}`)
        const token = await getLoginToken();
        await openBrowserAsync(
          `http://ethglobal.com/auth?signature=${token}&redirect=/packs/${pack.slug}`
        );
      }}
    >
      <View className="flex flex-col w-full">
        <View className="max-w-full border-2 border-gray-900 border-b-0 rounded-t-lg p-0 bg-white flex justify-center items-center">
          <View className="w-full overflow-hidden rounded-t-md">
            <Image
              style={{
                width: 400,
                height: 180,
              }}
              source={pack.image}
            />
          </View>
        </View>
        <View className="border-2 border-gray-900 rounded-b-lg bg-gray-900 px-6 py-4">
          <View className="flex flex-row w-full justify-between items-center">
            <ThemedText className="text-2xl" weight="semibold" color="white">
              {pack.name}
            </ThemedText>
            <Feather name="arrow-up-right" size={24} color="white" />
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function PacksScreen() {
  const router = useRouter();

  const { data: packsData, loading: packsLoading } = useQuery(gql`
    query getPacksSelf {
      getPacksSelf {
        slug
        name
        image
      }
    }
  `);

  if (packsLoading) {
    return <Loading />;
  }

  const packs = packsData.getPacksSelf;

  return (
    <View className="w-full h-full">
      <Background />
      <SafeAreaView>
        <ScrollView>
          <View className="flex flex-col justify-start items-center w-full h-full py-4 pb-44">
            <Climb style={{ marginTop: 40 }} width={120} height={120} />
            <ThemedText className="text-5xl mt-6" weight="semibold">
              My Packs
            </ThemedText>
            <View className="flex flex-col justify-start items-center w-[80%] gap-4 mt-8">
              {packs.map((pack: any, index: number) => (
                <PackCard key={index} pack={pack} />
              ))}
            </View>
            <Pressable
              onPress={async () => {
                const token = await getLoginToken();
                await openBrowserAsync(
                  `http://ethglobal.com/auth?signature=${token}&redirect=/packs`
                );
              }}
              className="flex flex-row w-[80%] justify-between items-center mt-6 p-4 border-2 border-gray-900 bg-white"
            >
              <ThemedText className="text-xl" weight="medium">
                {packs.length > 0
                  ? "Want more? Mint a new pack"
                  : "No packs? Mint a new pack"}
              </ThemedText>

              <Feather name="arrow-up-right" size={24} color="black" />
            </Pressable>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

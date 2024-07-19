import Background from "@/components/Background";
import { ThemedText } from "@/components/ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View, SafeAreaView, Pressable } from "react-native";

export default function ScheduleScreen() {
  const router = useRouter();

  return (
    <View className="w-full h-full">
      <Background />
      <SafeAreaView>
        <View className="flex flex-row justify-start items-center w-full px-8 pt-2 pb-4">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={30} color="black" />
          </Pressable>
        </View>
        <View className="flex flex-col justify-start items-center w-full h-full py-4">
          <ThemedText>Schedule Screen</ThemedText>
        </View>
      </SafeAreaView>
    </View>
  );
}

import { SafeAreaView, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import Robot from "@/assets/images/robot.svg";
import { useEffect } from "react";
import Background from "@/components/Background";

export default function Loading() {
  const offset = useSharedValue(1);
  useEffect(() => {
    offset.value = withRepeat(
      withTiming(-offset.value, { duration: 1000, easing: Easing.ease }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value * 20 }],
  }));

  return (
    <View className="w-full h-full">
      <Background />
      <SafeAreaView>
        <View className="w-full h-full flex justify-center items-center">
          <Animated.View style={animatedStyle}>
            <Robot width={300} height={270} />
          </Animated.View>
        </View>
      </SafeAreaView>
    </View>
  );
}

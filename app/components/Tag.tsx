import { ColorValue, View } from "react-native";
import { ThemedText } from "./ThemedText";

export default function Tag({
  text,
  color,
}: {
  text: string;
  color: ColorValue;
}) {
  return (
    <View
      style={{
        backgroundColor: color,
        alignSelf: "flex-start",
      }}
      className="rounded-full border-2 border-gray-900 py-1 px-2"
    >
      <ThemedText weight="medium">{text}</ThemedText>
    </View>
  );
}

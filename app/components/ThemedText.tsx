import { colors } from "@/constants/colors";
import { ColorValue, Text, type TextProps } from "react-native";

export type ThemedTextProps = TextProps & {
  weight?: "regular" | "medium" | "semibold" | "bold" | "heavy" | "light";
  fontStyle?: "normal" | "italic";
  color?: ColorValue;
};

const fontFamilyVariants = {
  regular: {
    normal: "Roobert-Regular",
    italic: "Roobert-RegularItalic",
  },
  medium: {
    normal: "Roobert-Medium",
    italic: "Roobert-MediumItalic",
  },
  semibold: {
    normal: "Roobert-SemiBold",
    italic: "Roobert-SemiBoldItalic",
  },
  bold: {
    normal: "Roobert-Bold",
    italic: "Roobert-BoldItalic",
  },
  heavy: {
    normal: "Roobert-Heavy",
    italic: "Roobert-HeavyItalic",
  },
  light: {
    normal: "Roobert-Light",
    italic: "Roobert-LightItalic",
  },
};

export function ThemedText({
  weight = "regular",
  fontStyle = "normal",
  color = "#000000",
  ...props
}: ThemedTextProps) {
  return (
    <Text
      style={{
        fontFamily: fontFamilyVariants[weight][fontStyle],
        color,
      }}
      {...props}
    />
  );
}

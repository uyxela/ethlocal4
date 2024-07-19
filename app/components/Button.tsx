import { colors } from "@/constants/colors";
import {
  ColorValue,
  Pressable,
  TouchableOpacity,
  type TouchableOpacityProps,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";

type ButtonProps = TouchableOpacityProps & {
  type?: "primary" | "secondary" | "disabled";
  title: string;
};

const buttonVariants = {
  primary: {
    backgroundColor: colors.button.primary,
  },
  secondary: {
    backgroundColor: colors.button.secondary,
  },
  disabled: {
    backgroundColor: colors.button.disabled,
  },
  transparent: {
    backgroundColor: colors.button.transparent,
  },
};

export function Button({ title, type = "primary", ...props }: ButtonProps) {
  return (
    <Pressable
      style={{
        backgroundColor: "#1A1A1A",
        borderRadius: 12,
        width: "90%",
      }}
      className="bg-gray-900 active:bg-gray-800 py-2 flex justify-center items-center"
      {...props}
    >
      <ThemedText className="text-lg" weight="semibold" color="#FFFFFF">
        {title}
      </ThemedText>
    </Pressable>
  );
}

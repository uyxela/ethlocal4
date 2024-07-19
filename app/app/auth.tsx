import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { ThemedText } from "@/components/ThemedText";
import { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";

import Logo from "@/assets/images/logo.svg";
import { gql, useMutation } from "@apollo/client";
import { setItemAsync } from "expo-secure-store";

const CELL_COUNT = 6;

export default function AuthScreen() {
  const router = useRouter();
  const { csrf, email } = useLocalSearchParams<{
    csrf: string;
    email: string;
  }>();

  const [value, setValue] = useState("");
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const [loginMutation, { loading }] = useMutation(
    gql`
      mutation loginWithOtp($code: String!, $csrf: String!, $email: String!) {
        loginWithOtp(code: $code, csrf: $csrf, email: $email) {
          token
          success
        }
      }
    `,
    {
      variables: {
        code: value,
        csrf,
        email,
      },
    }
  );

  if (!csrf || !email) {
    router.replace("/");
  }

  useEffect(() => {
    async function login() {
      const { data } = await loginMutation();

      if (data?.loginWithOtp?.success) {
        // need to store cookie here
        await setItemAsync("token", data.loginWithOtp.token);
        router.push("/home");
      }
    }

    if (value.length === 6) {
      void login();
    }
  }, [value]);

  return (
    <SafeAreaView>
      <View className="flex flex-col justify-start items-center w-full h-full py-4">
        <View className="flex flex-row w-full justify-center items-center">
          <Pressable
            onPress={() => router.back()}
            className="w-1/3 pl-6 flex justify-center items-start"
          >
            <Ionicons name="arrow-back" size={24} color="black" />
          </Pressable>
          <View className="w-1/3 flex justify-center items-center">
            <Logo className="1flex-" width={120} height={36} />
          </View>
          <View className="w-1/3" />
        </View>

        <View className="flex flex-col justify-center items-center mt-20">
          <View className="flex flex-col items-center justify-center">
            <ThemedText className="text-xl text-center" color="#374151">
              We've emailed a one-time PIN to
            </ThemedText>
            <ThemedText className="text-xl text-center" weight="semibold">
              {email}.
            </ThemedText>
            <ThemedText className="text-xl text-center" color="#374151">
              Please check your inbox.
            </ThemedText>
          </View>

          <Image
            style={{
              width: 250,
              height: 75,
              marginTop: 50,
            }}
            source={require("../assets/images/icons.webp")}
          />

          <CodeField
            ref={ref}
            {...props}
            value={value}
            onChangeText={setValue}
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            renderCell={({ index, symbol, isFocused }) => (
              <Text
                key={index}
                style={[styles.cell, isFocused && styles.focusCell]}
                onLayout={getCellOnLayoutHandler(index)}
              >
                {symbol || (isFocused ? <Cursor /> : null)}
              </Text>
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, padding: 20 },
  title: { textAlign: "center", fontSize: 30 },
  codeFieldRoot: { marginTop: 70, display: "flex" },
  cell: {
    marginHorizontal: 4,
    borderRadius: 8,
    width: 50,
    height: 70,
    lineHeight: 64,
    fontSize: 30,
    fontFamily: "Roobert-Light",
    borderWidth: 2,
    color: "#6B7280",
    borderColor: "#00000030",
    textAlign: "center",
  },
  focusCell: {
    borderColor: "#C084FC",
  },
});

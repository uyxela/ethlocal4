import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Pressable, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedText } from "@/components/ThemedText";

import Logo from "@/assets/images/logo.svg";
import Robot from "@/assets/images/robot.svg";
import {
  useLocalSearchParams,
  useRootNavigationState,
  useRouter,
} from "expo-router";
import { gql, useMutation } from "@apollo/client";
import { deleteItemAsync, getItem } from "expo-secure-store";

export default function WelcomeScreen() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();

  const { csrf, email: emailParam } = useLocalSearchParams<{
    csrf?: string;
    email?: string;
  }>();
  const token = getItem("token");

  const [login, { loading }] = useMutation(
    gql`
      mutation loginWithEmail($email: String!) {
        loginWithEmail(email: $email, host: "http://localhost:4200/") {
          csrf
          success
        }
      }
    `,
    { variables: { email } }
  );

  useEffect(() => {
    if (csrf && emailParam && rootNavigationState.key) {
      router.push("/auth");
    }
  }, [csrf, emailParam, rootNavigationState.key]);

  useEffect(() => {
    if (token && rootNavigationState.key) {
      router.push("/home");
    }
  }, [token, rootNavigationState.key]);

  return (
    <SafeAreaView>
      <KeyboardAvoidingView
        behavior="padding"
        className="flex flex-col justify-between items-center w-full h-full py-4"
      >
        <Logo width={120} height={36} />

        <View>
          <ThemedText className="text-2xl text-center" weight="semibold">
            Let's build something amazing.
          </ThemedText>
          <ThemedText className="text-center" color="secondary">
            Enter your email below to receive a magic sign-in link.
          </ThemedText>
        </View>

        <Robot width={300} height={270} />

        <View className="flex flex-col gap-2 justify-end items-center w-full mb-4">
          <TextInput
            className="w-[90%] border border-gray-300 rounded-xl color-gray-700 h-14 px-4 focus:border-purple-400"
            onChangeText={setEmail}
            placeholder="example@domain.com"
            value={email}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Pressable
            onPress={async () => {
              const { data } = await login();

              if (data?.loginWithEmail?.success) {
                router.push({
                  pathname: "/auth",
                  params: {
                    csrf: data.loginWithEmail.csrf,
                    email,
                  },
                });
              }
            }}
            className="w-[90%] rounded-xl bg-gray-900 active:bg-gray-800 h-14 flex justify-center items-center"
          >
            <ThemedText weight="medium" className="text-xl" color="#FFFFFF">
              {loading ? "Loading..." : "Continue"}
            </ThemedText>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

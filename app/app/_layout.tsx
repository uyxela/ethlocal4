import "expo-dev-client";

import { DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { Video } from "expo-av";
import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { AuthProvider } from "@/hooks/useAuth";
import { SafeAreaProvider } from "react-native-safe-area-context";

import "@/global.css";
import { httpLink } from "@/utils/apollo";
import { NotificationsProvider } from "@/hooks/useNotifications";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const client = new ApolloClient({
  link: httpLink,
  uri: "https://35e885c5c655.ngrok.app/graphql",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider value={DefaultTheme}>
        <ApolloProvider client={client}>
          <AuthProvider>
            <NotificationsProvider>
              <Slot />
            </NotificationsProvider>
          </AuthProvider>
        </ApolloProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

function VideoSplashScreen({ children }: { children: ReactNode }) {
  const videoOpacity = useMemo(() => new Animated.Value(1), []);
  const childrenOpacity = useMemo(() => new Animated.Value(0), []);
  const [showChildren, setShowChildren] = useState(false);

  const video = useRef(null);

  useEffect(() => {
    setTimeout(
      () =>
        Animated.timing(videoOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }).start(() => {
          setShowChildren(true);
          Animated.timing(childrenOpacity, {
            toValue: 1,
            duration: 250,
            useNativeDriver: true,
          }).start();
        }),
      4000
    );
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={{
          opacity: childrenOpacity,
          display: "flex",
          flex: 1,
          height: "100%",
          width: "100%",
        }}
      >
        {children}
      </Animated.View>
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: "#FFFFFF",
            opacity: videoOpacity,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100%",
            width: "100%",
            position: "absolute",
            top: 0,
            left: 0,
            zIndex: 999,
          },
        ]}
      >
        <Video
          ref={video}
          source={require("../assets/videos/splash.mp4")}
          isMuted
          shouldPlay
          videoStyle={{
            width: 300,
            height: 200,
          }}
          style={{
            width: 300,
            height: 200,
          }}
          rate={1.5}
        />
      </Animated.View>
    </View>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    "Roobert-Regular": require("../assets/fonts/Roobert-Regular.otf"),
    "Roobert-RegularItalic": require("../assets/fonts/Roobert-RegularItalic.otf"),
    "Roobert-Medium": require("../assets/fonts/Roobert-Medium.otf"),
    "Roobert-MediumItalic": require("../assets/fonts/Roobert-MediumItalic.otf"),
    "Roobert-SemiBold": require("../assets/fonts/Roobert-SemiBold.otf"),
    "Roobert-SemiBoldItalic": require("../assets/fonts/Roobert-SemiBoldItalic.otf"),
    "Roobert-Bold": require("../assets/fonts/Roobert-Bold.otf"),
    "Roobert-BoldItalic": require("../assets/fonts/Roobert-BoldItalic.otf"),
    "Roobert-Heavy": require("../assets/fonts/Roobert-Heavy.otf"),
    "Roobert-HeavyItalic": require("../assets/fonts/Roobert-HeavyItalic.otf"),
    "Roobert-Light": require("../assets/fonts/Roobert-Light.otf"),
    "Roobert-LightItalic": require("../assets/fonts/Roobert-LightItalic.otf"),
  });

  useEffect(() => {
    // Load key assets here
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <VideoSplashScreen>
      <App />
    </VideoSplashScreen>
  );
}

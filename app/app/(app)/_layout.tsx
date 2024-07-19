import { colors } from "@/constants/colors";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, Tabs } from "expo-router";
import { getItem } from "expo-secure-store";
import { Pressable, View } from "react-native";

import Home from "@/assets/images/home.svg";
import Events from "@/assets/images/events.svg";
import Packs from "@/assets/images/packs.svg";
import User from "@/assets/images/user.svg";

export default function AppLayout() {
  if (!getItem("token")) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs
      sceneContainerStyle={{
        backgroundColor: "#FFFFFF",
      }}
      screenOptions={{
        tabBarActiveTintColor: colors.tabBarActive,
        tabBarInactiveTintColor: colors.tabBarInactive,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "transparent",
          position: "absolute",
          elevation: 0,
          borderTopWidth: 0,
        },
      }}
      initialRouteName="home"
      tabBar={(props) => {
        if (props.state.routes.length === 0) {
          return null;
        }

        console.log(JSON.stringify(props.state));

        return (
          <View
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 120,
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
            }}
          >
            <LinearGradient
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                bottom: 0,
                height: "100%",
                width: "100%",
              }}
              colors={["rgba(253,245,231,1)", "rgba(253,245,231,0)"]}
              locations={[0.8, 1]}
              start={{ x: 0.5, y: 1 }}
              end={{ x: 0.5, y: 0 }}
            />

            <Pressable
              onPress={() => {
                props.navigation.navigate("home");
              }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={[
                  {
                    height: 40,
                    width: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  },
                  props.state.index === 0 && {
                    borderBottomWidth: 2,
                    borderBottomColor: "#1f2937",
                    marginBottom: -2,
                  },
                ]}
              >
                <Home height={40} width={40} />
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                props.navigation.navigate("events");
              }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={[
                  {
                    height: 40,
                    width: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: -6,
                    paddingBottom: 6,
                  },
                  props.state.index === 2 && {
                    borderBottomWidth: 2,
                    borderBottomColor: "#1f2937",
                    marginBottom: -2,
                  },
                ]}
              >
                <Events height={32} width={32} />
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                props.navigation.navigate("packs");
              }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={[
                  {
                    height: 40,
                    width: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: -8,
                    paddingBottom: 8,
                  },
                  props.state.index === 1 && {
                    borderBottomWidth: 2,
                    borderBottomColor: "#1f2937",
                    marginBottom: -2,
                  },
                ]}
              >
                <Packs height={34} width={34} />
              </View>
            </Pressable>

            <Pressable
              onPress={() => {
                props.navigation.navigate("profile");
              }}
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={[
                  {
                    height: 40,
                    width: 10,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    paddingTop: -6,
                    paddingBottom: 6,
                  },
                  props.state.index === 3 && {
                    borderBottomWidth: 2,
                    borderBottomColor: "#1f2937",
                    marginBottom: -2,
                  },
                ]}
              >
                <User height={32} width={32} />
              </View>
            </Pressable>
          </View>
        );
      }}
    />
  );
}

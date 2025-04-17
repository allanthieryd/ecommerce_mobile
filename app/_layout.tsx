import { Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { useFonts } from "expo-font";
import { setBackgroundColorAsync } from "expo-navigation-bar";
import { preventAutoHideAsync, hideAsync } from "expo-splash-screen";
import { VarelaRound_400Regular } from "@expo-google-fonts/varela-round";
import { Rubik_400Regular, Rubik_700Bold } from "@expo-google-fonts/rubik";
import {
  UbuntuMono_400Regular,
  UbuntuMono_700Bold,
} from "@expo-google-fonts/ubuntu-mono";
import "./global.css";

preventAutoHideAsync(); // splash screen

export default function RootLayout() {
  StatusBar.setBackgroundColor("#15152A");
  setBackgroundColorAsync("#15152A");

  const [loaded, err] = useFonts({
    VarelaRound_400Regular,
    UbuntuMono_400Regular,
    UbuntuMono_700Bold,
    Rubik_400Regular,
    Rubik_700Bold,
  });

  useEffect(() => {
    if (loaded || err) {
      hideAsync();
    }
  }, [loaded, err]);

  if (!loaded && !err) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    ></Stack>
  );
}

// ThemeToggleButton.tsx
import React from "react";
import { Pressable, Text } from "react-native";
import { useColorScheme } from "nativewind";
import { Ionicons } from "@expo/vector-icons";

export default function ThemeToggleButton() {
  const { colorScheme, setColorScheme } = useColorScheme();

  const isDark = colorScheme === "dark";

  const toggleTheme = () => {
    setColorScheme(isDark ? "light" : "dark");
  };

  return (
    <Pressable
      onPress={toggleTheme}
      className="bg-gray-400 dark:bg-gray-800 py-3 px-4 rounded-md flex-row items-center justify-center"
    >
      <Ionicons
        name={isDark ? "sunny" : "moon"}
        size={20}
        color="white"
        className="mr-2"
      />
      <Text className="text-white text-base font-medium">
        {colorScheme === "dark" ? "Passer en clair" : "Passer en sombre"}
      </Text>
    </Pressable>
  );
}

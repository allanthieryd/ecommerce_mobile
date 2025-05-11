import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

export default function BackArrow() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <Ionicons
      name="arrow-back-outline"
      size={24}
      color={isDark ? "#fff" : "#000"}
    />
  );
}

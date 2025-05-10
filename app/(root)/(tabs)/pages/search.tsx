import { View, Text, TextInput, Pressable } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";

const search = () => {
  return (
    <View className="flex-1 p-4 bg-gray-100 dark:bg-gray-800">
      <Text className="text-center text-2xl font-bold mb-6 dark:text-white">Recherche</Text>

      <View className="flex-row items-center bg-white dark:bg-gray-700 rounded-xl px-4 py-2 shadow-md">
        <Ionicons name="search" size={20} color="#6B7280" className="mr-2" />
        <TextInput
          placeholder="Rechercher un article..."
          placeholderTextColor="#9CA3AF"
          className="flex-1 text-black dark:text-white"
        />
        <Pressable>
          <Ionicons name="close-circle" size={20} color="#9CA3AF" />
        </Pressable>
      </View>
    </View>
  );
};

export default search;

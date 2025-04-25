import { View, Text, TouchableOpacity } from "react-native";
import { Image } from "react-native";
import React from "react";
import { Link } from "expo-router";

const index = () => {
  return (
    <View className="justify-center h-screen bg-purple-500 p-8">
      {/* Logo */}
      <View className="items-center mb-16">
        <Image
          source={require("@/assets/images/logo.png")}
        />
      </View>

      {/* Boutons */}
      <View className="space-y-8">
        <Link className="my-4" href={"/pages/SignUpPage"} asChild>
          <TouchableOpacity className="bg-gray-200 py-4 rounded-md items-center">
            <Text className="font-Varela_Round text-lg text-black">
              Créer un compte
            </Text>
          </TouchableOpacity>
        </Link>
        <Link href={"/pages/SignInPage"} asChild>
          <TouchableOpacity className="bg-gray-200 py-4 rounded-md items-center">
            <Text className="font-Varela_Round text-lg text-black">
              Se connecter
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default index;
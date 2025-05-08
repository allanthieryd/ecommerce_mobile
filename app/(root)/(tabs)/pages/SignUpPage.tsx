import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const SignUpPage = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <View className="flex-1 justify-center items-center bg-purple-500 p-8">
      {/* Logo */}
      <View className="items-center mb-16">
        <Image
          source={require("@/assets/images/logo.png")}
        />
      </View>

      {/* Formulaire */}
      <View className="w-full space-y-4">
        {/* Nom */}
        <TextInput
          placeholder="Entrer votre nom"
          placeholderTextColor="#000"
          className="bg-gray-200 py-4 px-4 rounded-md text-black mb-4"
        />

        {/* Adresse e-mail */}
        <TextInput
          placeholder="Entrer une adresse mail"
          placeholderTextColor="#000"
          className="bg-gray-200 py-4 px-4 rounded-md text-black mb-4"
        />

        {/* Mot de passe */}
        <View className="bg-gray-200 py-1 px-4 rounded-md flex-row items-center mb-4">
          <TextInput
            placeholder="Créer un mot de passe"
            placeholderTextColor="#000"
            secureTextEntry={!passwordVisible}
            className="flex-1 text-black"
          />
          <TouchableOpacity
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <Ionicons
              name={passwordVisible ? "eye-off" : "eye"}
              size={20}
              color="black"
            />
          </TouchableOpacity>
        </View>

        {/* Bouton S'inscrire */}
        <TouchableOpacity className="bg-yellow-400 py-4 rounded-md items-center">
          <Text className="text-black text-lg font-bold">S'inscrire</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUpPage;

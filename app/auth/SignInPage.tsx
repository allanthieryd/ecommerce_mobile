import React, { useState } from "react"
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { loginUser } from "@/services/login"
import { useRouter } from "expo-router"

const SignInPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordVisible, setPasswordVisible] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    try {
      // Appel de la fonction loginUser avec email et mot de passe
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const user = await loginUser(email, password)
      router.push("/pages/homepage");
    } catch (error: any) {
      Alert.alert("Erreur", error.message)
    }
  }

  return (
    <View className="flex-1 justify-center items-center bg-purple-500 p-8">
      {/* Logo */}
      <View className="items-center mb-16">
        <Image source={require("@/assets/images/logo.png")} />
      </View>

      {/* Formulaire */}
      <View className="w-full space-y-4">
        {/* Adresse e-mail */}
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Entrer une adresse mail"
          placeholderTextColor="#000"
          className="bg-gray-200 py-4 px-4 rounded-md text-black mb-4"
        />

        {/* Mot de passe */}
        <View className="bg-gray-200 py-1 px-4 rounded-md flex-row items-center mb-4">
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Entrer un mot de passe"
            placeholderTextColor="#000"
            secureTextEntry={!passwordVisible}
            className="flex-1 text-black"
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Ionicons
              name={passwordVisible ? "eye-off" : "eye"}
              size={20}
              color="black"
            />
          </TouchableOpacity>
        </View>

        {/* Mot de passe oublié */}
        <TouchableOpacity>
          <Text className="text-white text-sm text-right">Mot de passe oublié ?</Text>
        </TouchableOpacity>

        {/* Bouton Se connecter */}
        <TouchableOpacity
          className="bg-yellow-400 py-4 rounded-md items-center"
          onPress={handleLogin} // Connexion avec email et mot de passe
        >
          <Text className="text-black text-lg font-bold">Se connecter</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default SignInPage

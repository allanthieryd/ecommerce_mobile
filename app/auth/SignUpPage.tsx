import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { registerUser } from "@/services/register" // Assure-toi que le chemin est correct

const SignUpPage = () => {
  // État des champs du formulaire
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false); // pour gérer l'état de chargement

  // Fonction pour gérer l'inscription
  const handleSignUp = async () => {
    setLoading(true);
    try {
      const user = await registerUser(email, password, nom, prenom);
      Alert.alert(`Inscription réussie, un email de confirmation a été envoyé à ${user.email}.`);
      // Optionnel: Rediriger l'utilisateur après inscription, si nécessaire
    } catch (error: any) {
      console.error(error);
      Alert.alert("Erreur", error.message || "Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-purple-500 p-8">
      {/* Logo */}
      <View className="items-center mb-16">
        <Image source={require("@/assets/images/logo.png")} />
      </View>

      {/* Formulaire */}
      <View className="w-full space-y-4">
        {/* Nom */}
        <TextInput
          placeholder="Entrer votre nom"
          value={nom}
          onChangeText={setNom}
          placeholderTextColor="#000"
          className="bg-gray-200 py-4 px-4 rounded-md text-black mb-4"
        />

        {/* Prénom */}
        <TextInput
          placeholder="Entrer votre prénom"
          value={prenom}
          onChangeText={setPrenom}
          placeholderTextColor="#000"
          className="bg-gray-200 py-4 px-4 rounded-md text-black mb-4"
        />

        {/* Adresse e-mail */}
        <TextInput
          placeholder="Entrer une adresse mail"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#000"
          keyboardType="email-address"
          className="bg-gray-200 py-4 px-4 rounded-md text-black mb-4"
        />

        {/* Mot de passe */}
        <View className="bg-gray-200 py-1 px-4 rounded-md flex-row items-center mb-4">
          <TextInput
            placeholder="Créer un mot de passe"
            value={password}
            onChangeText={setPassword}
            placeholderTextColor="#000"
            secureTextEntry={!passwordVisible}
            className="flex-1 text-black"
          />
          <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
            <Ionicons name={passwordVisible ? "eye-off" : "eye"} size={20} color="black" />
          </TouchableOpacity>
        </View>

        {/* Bouton S'inscrire */}
        <TouchableOpacity
          className="bg-yellow-400 py-4 rounded-md items-center"
          onPress={handleSignUp}
          disabled={loading} // Désactive le bouton lors du chargement
        >
          <Text className="text-black text-lg font-bold">{loading ? "Chargement..." : "S'inscrire"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SignUpPage;

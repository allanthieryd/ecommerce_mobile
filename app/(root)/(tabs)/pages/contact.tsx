import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { addMessage } from "@/services/contact";

export default function ContactPage() {
  const [email, setEmail] = useState("");
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [num, setNum] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ success: false, message: "" });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setStatus({ success: false, message: "" });
  
    if (!email || !nom || !prenom) {
      setStatus({
        success: false,
        message: "Veuillez remplir tous les champs obligatoires."
      });
      setIsSubmitting(false);
      return;
    }
  
    try {
      await addMessage({
        nom,
        prenom,
        email,
        num,
        message,
      });
  
      setStatus({
        success: true,
        message: "Votre message a été envoyé avec succès !"
      });
  
      setEmail("");
      setNom("");
      setPrenom("");
      setNum("");
      setMessage("");
  
      Alert.alert("Succès", "Votre message a été envoyé avec succès !");
    } catch (error) {
      console.error(error);
      setStatus({
        success: false,
        message: "Une erreur est survenue. Veuillez réessayer plus tard."
      });
    } finally {
      setIsSubmitting(false);
    }
  };  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="py-6 px-4">
        <View className="mb-6 items-center">
          <Text className="text-2xl font-bold">
            Formulaire de{" "}
            <Text className="text-[#02ff1e] font-bold">Contact</Text>
          </Text>
        </View>

        <View className="bg-white rounded-lg p-4 shadow-md">
          {status.message ? (
            <View
              className={`p-3 rounded mb-4 ${
                status.success ? "bg-green-100" : "bg-red-100"
              }`}
            >
              <Text
                className={`${
                  status.success ? "text-green-700" : "text-red-700"
                }`}
              >
                {status.message}
              </Text>
            </View>
          ) : null}

          <Text className="text-violet-600 font-bold mt-4 mb-1 text-base">
            Nom <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="border border-gray-200 bg-violet-100 rounded px-3 py-2 text-gray-700 text-base"
            value={nom}
            onChangeText={setNom}
            placeholder="Votre nom"
            placeholderTextColor="#9CA3AF"
          />

          <Text className="text-violet-600 font-bold mt-4 mb-1 text-base">
            Prénom <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="border border-gray-200 bg-violet-100 rounded px-3 py-2 text-gray-700 text-base"
            value={prenom}
            onChangeText={setPrenom}
            placeholder="Votre prénom"
            placeholderTextColor="#9CA3AF"
          />

          <Text className="text-violet-600 font-bold mt-4 mb-1 text-base">
            E-mail <Text className="text-red-500">*</Text>
          </Text>
          <TextInput
            className="border border-gray-200 bg-violet-100 rounded px-3 py-2 text-gray-700 text-base"
            value={email}
            onChangeText={setEmail}
            placeholder="Votre email"
            placeholderTextColor="#9CA3AF"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text className="text-violet-600 font-bold mt-4 mb-1 text-base">
            Numéro de téléphone
          </Text>
          <TextInput
            className="border border-gray-200 bg-violet-100 rounded px-3 py-2 text-gray-700 text-base"
            value={num}
            onChangeText={setNum}
            placeholder="Votre numéro de téléphone"
            placeholderTextColor="#9CA3AF"
            keyboardType="phone-pad"
          />

          <Text className="text-violet-600 font-bold mt-4 mb-1 text-base">
            Message
          </Text>
          <TextInput
            className="border border-gray-200 bg-violet-100 rounded px-3 py-2 text-gray-700 text-base min-h-[120px] text-top"
            value={message}
            onChangeText={setMessage}
            placeholder="Votre message"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />

          <TouchableOpacity
            className={`bg-violet-600 rounded-full py-3 px-6 mt-6 min-w-[60%] self-center items-center ${
              isSubmitting ? "opacity-70" : ""
            }`}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Text className="text-white font-bold text-base">Envoyer</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

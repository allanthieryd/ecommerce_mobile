import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Link, useRouter } from "expo-router"; // Importation de useRouter pour la redirection
import { checkUserSession } from "../utils/auth"; // Assure-toi que le chemin d'importation est correct

const IndexPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter(); // Initialisation de useRouter pour la redirection

  // Vérifie si l'utilisateur est connecté au montage du composant
  useEffect(() => {
    const verifyUser = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const user = await checkUserSession();
        setIsLoggedIn(true); // Utilisateur connecté

        // Rediriger vers la page d'accueil (HomePage)
        router.push("/pages/homepage"); // Remplace "/homepage" par le chemin de ta page d'accueil
      } catch (error) {
        setIsLoggedIn(false); // Utilisateur non connecté
        console.error("Erreur de connexion :", error);
      }
    };

    verifyUser();
  }, [router]);

  if (isLoggedIn === null) {
    return (
      <View className="flex-1 justify-center items-center bg-purple-500 p-8">
        <Text className="text-white">Chargement...</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <View className="flex-1 justify-center items-center bg-purple-500 p-8">
        {/* Logo */}
        <View className="items-center mb-16">
          <Image
            source={require("@/assets/images/logo.png")}
            style={{ width: 100, height: 100 }}
          />
        </View>

        {/* Boutons */}
        <View className="space-y-8">
          <Link href={"/auth/SignUpPage"} asChild>
            <TouchableOpacity className="bg-gray-200 py-4 rounded-md items-center">
              <Text className="font-Varela_Round text-lg text-black">
                Créer un compte
              </Text>
            </TouchableOpacity>
          </Link>
          <Link href={"/auth/SignInPage"} asChild>
            <TouchableOpacity className="bg-gray-200 py-4 rounded-md items-center">
              <Text className="font-Varela_Round text-lg text-black">
                Se connecter
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    );
  }
};

export default IndexPage;

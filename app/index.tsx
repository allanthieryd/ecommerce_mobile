import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Link, useRouter } from "expo-router";
import { checkUserSession } from "@/utils/auth";

const IndexPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const verifyUser = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const user = await checkUserSession();
        setIsLoggedIn(true);
        router.push("/pages/homepage");
      } catch (error) {
        setIsLoggedIn(false);
        console.error("Erreur de connexion :", error);
      }
    };

    verifyUser();
  }, [router]);

  if (isLoggedIn === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#9333EA", padding: 32 }}>
        <Text style={{ color: "#fff" }}>Chargement...</Text>
      </View>
    );
  }

  if (!isLoggedIn) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#9333EA", padding: 32 }}>
        {/* Logo */}
        <View style={{ alignItems: "center", marginBottom: 64 }}>
          <Image
            source={require("@/assets/images/logo.png")}
            style={{ width: 100, height: 100, resizeMode: "contain" }}
          />
        </View>

        {/* Boutons */}
        <View style={{ width: "100%", gap: 32 }}>
          <Link href={"/auth/SignUpPage"} asChild>
            <TouchableOpacity style={{ backgroundColor: "#E5E7EB", paddingVertical: 16, borderRadius: 8, alignItems: "center" }}>
              <Text style={{ fontSize: 18, color: "#000" }}>Créer un compte</Text>
            </TouchableOpacity>
          </Link>
          <Link href={"/auth/SignInPage"} asChild>
            <TouchableOpacity style={{ backgroundColor: "#E5E7EB", paddingVertical: 16, borderRadius: 8, alignItems: "center" }}>
              <Text style={{ fontSize: 18, color: "#000" }}>Se connecter</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    );
  }
};

export default IndexPage;

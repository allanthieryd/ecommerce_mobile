// app/produit/[id].tsx
import { useLocalSearchParams } from "expo-router";
import { View, Text, Image } from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { getProductImageUrl } from "@/services/productService";
import { useNavigation } from "expo-router";

export default function ProductDetail() {
  const { id } = useLocalSearchParams(); // ← récupère l'ID de l'URL
  const navigation = useNavigation();
  const [produit, setProduit] = useState<any>(null);

  useEffect(() => {
    const fetchProduit = async () => {
      const { data, error } = await supabase
        .from("produits")
        .select("*")
        .eq("id_produit", id)
        .single();

      if (error) {
        console.error("Erreur de récupération :", error);
      } else {
        setProduit(data);
      }
    };

    if (id) fetchProduit();
  }, [id]);
    
     // Met à jour le titre de la page dynamiquement
  useLayoutEffect(() => {
    if (produit?.nom) {
      navigation.setOptions({ title: produit.nom });
    }
  }, [navigation, produit]);

  if (!produit) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white p-6">
      <Image
        source={{ uri: getProductImageUrl(produit.image_url) }}
        style={{ width: "100%", height: 200, resizeMode: "contain" }}
      />
      <Text className="text-2xl font-bold mt-4">{produit.nom}</Text>
      <Text className="mt-2 text-gray-700">{produit.description}</Text>
    </View>
  );
}

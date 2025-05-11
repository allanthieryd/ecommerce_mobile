// app/produit/[id].tsx
import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { getProductImageUrl } from "@/services/productService";
import { useNavigation } from "expo-router";
import ProductImageCarousel from "@/components/ProductImageCarousel";

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
  const imageUrl = produit.image_url ? getProductImageUrl(produit.image_url) : null;

  return (
    <View className="flex-1 bg-white dark:bg-gray-800 p-6">
      <ProductImageCarousel uri={imageUrl} />
      <Text className="text-2xl font-bold mt-4 dark:text-white">{produit.nom}</Text>
      <Text className="mt-2 text-gray-700 dark:text-white">{produit.description}</Text>
    </View>
  );
}

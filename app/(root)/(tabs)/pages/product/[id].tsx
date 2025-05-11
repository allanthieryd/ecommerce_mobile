// app/produit/[id].tsx
import { useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView } from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import { getProductImageUrl } from "@/services/productService";
import { useNavigation } from "expo-router";
import ProductCarousel from "@/components/ProductCarousel";
import { fetchProducts } from "@/services/product";
import { ProductDetailText } from "@/components/ProductDetail";
import SimilarProducts from "@/components/similarProducts";

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [produit, setProduit] = useState<any>(null);
  const [carouselImages, setCarouselImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchProduit = async () => {
      try {
        const data = await fetchProducts({ id: Number(id) }); // ← ici on passe l’ID au service
  
        if (!data || data.length === 0) {
          console.warn("Aucun produit trouvé.");
          return;
        }
  
        const produit = data[0];
        setProduit(produit);
  
        if (produit.carousel) {
          setCarouselImages(
            produit.carousel.map((path: string) => getProductImageUrl(path))
          );
        }
      } catch (error) {
        console.error("Erreur de récupération :", error);
      }
    };
  
    if (id) fetchProduit();
  }, [id]);

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
    <ScrollView className="flex-1 bg-white dark:bg-gray-800">
    <ProductCarousel images={carouselImages} />
    <View className="p-6">
      <Text className="text-4xl font-bold mt-4 dark:text-white">
        {produit.nom}
      </Text>
      <Text className="text-xl mt-2 text-gray-700 dark:text-white">
        {produit.description}
        </Text>
      <ProductDetailText produit={produit} />
      </View>
      <View className="flex-1 bg-white dark:bg-gray-800 p-6">
      {produit && <SimilarProducts productId={produit.id_produit} />}
      </View>
  </ScrollView>
  );
}
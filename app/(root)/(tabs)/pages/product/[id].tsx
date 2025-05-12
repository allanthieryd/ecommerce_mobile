// app/produit/[id].tsx
import { useLocalSearchParams } from "expo-router";
import { View, Text, ScrollView, Alert, TouchableOpacity } from "react-native";
import { useEffect, useLayoutEffect, useState } from "react";
import { getProductImageUrl } from "@/services/productService";
import { useNavigation } from "expo-router";
import ProductCarousel from "@/components/ProductCarousel";
import { fetchProducts } from "@/services/product";
import { ProductDetailText } from "@/components/ProductDetail";
import SimilarProducts from "@/components/similarProducts";
import { supabase } from "@/utils/supabase";
import { addToCart, fetchCart, updateCartItem } from "@/services/cart";

interface Product {
  id_produit: number;
  nom: string;
  description?: string;
  image_url?: string;
  tarif_utilisateur: number;
}

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

  
  const handleAddToCart = async (produit: Product) => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session?.user) {
        Alert.alert("Erreur", "Vous devez être connecté pour ajouter au panier.");
        return;
      }
  
      const userId = sessionData.session.user.id;
      const existingCart = await fetchCart(userId);
  
      const existingItem = existingCart.find(
        (item: any) => item.id_produit === produit.id_produit
      );
  
      if (existingItem) {
        await updateCartItem({
          id_produit: existingItem.id_produit,
          quantite: existingItem.quantite + 1,
          prix_unitaire: produit.tarif_utilisateur,
        });
        Alert.alert("Panier mis à jour", "La quantité a été augmentée.");
      } else {
        await addToCart({
          id_produit: produit.id_produit,
          quantite: 1,
          prix_unitaire: produit.tarif_utilisateur,
          nom: produit.nom,
          id_utilisateur: userId,
        });
        Alert.alert("Ajouté", "Produit ajouté au panier !");
      }
    } catch (error: any) {
      Alert.alert("Erreur", "Une erreur est survenue : " + error.message);
    }
  };

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
      <TouchableOpacity
          onPress={() => handleAddToCart(produit)}
          className="bg-gray-400 dark:bg-black py-3 px-2 rounded-xl items-center gap-4"
        >
          <Text className="text-white text-sm font-semibold">Ajouter au panier</Text>
        </TouchableOpacity>
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
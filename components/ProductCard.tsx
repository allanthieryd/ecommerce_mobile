import React from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { getProductImageUrl } from "@/services/productService";
import { supabase } from "@/utils/supabase";
import { addToCart, fetchCart, updateCartItem } from "@/services/cart";

interface Product {
  id_produit: number;
  nom: string;
  description?: string;
  image_url?: string;
  tarif_utilisateur: number;
}

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

export default function ProductCard({ product }: { product: Product }) {
  const imageUrl = product.image_url ? getProductImageUrl(product.image_url) : null;

  return (
    <View className="bg-white dark:bg-slate-700 rounded-2xl p-4 mb-4 shadow-md mx-4">
      {imageUrl && (
        <Image
          source={{ uri: imageUrl }}
          className="w-full h-56 rounded-t-2xl"
          resizeMode="cover"
        />
      )}
      <Text className="text-base font-bold mt-3 dark:text-white">{product.nom}</Text>
      <Text className="text-gray-600 my-1 dark:text-gray-200" numberOfLines={2}>
        {product.description}
      </Text>
      <Text className="text-sm font-semibold mb-3 dark:text-white">
        {product.tarif_utilisateur}€
      </Text>
      <TouchableOpacity
        onPress={() => handleAddToCart(product)}
        className="bg-gray-400 dark:bg-black py-3 px-2 rounded-xl items-center gap-4"
      >
        <Text className="text-white text-sm font-semibold">Ajouter au panier</Text>
      </TouchableOpacity>
    </View>
  );
}

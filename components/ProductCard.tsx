import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { getProductImageUrl } from "@/services/productService"; // Assure-toi que ce chemin est correct

interface Product {
  id_produit: number;
  nom: string;
  description?: string;
  image_url?: string;
  tarif_utilisateur: number;
}

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
      <Text className="text-base font-bold mt-3 dark:text-white ">{product.nom}</Text>
      <Text className="text-gray-600 my-1 dark:text-gray-200 " numberOfLines={2}>
        {product.description}
      </Text>
      <Text className="text-sm font-semibold mb-3 dark:text-white ">
        {product.tarif_utilisateur}€
      </Text>
      <TouchableOpacity
        onPress={() => {
          // ajouter au panier ici
        }}
        className="bg-gray-400 dark:bg-gray-800 py-3 px-2 rounded-xl items-center gap-4"
      >
        <Text className="text-white text-sm font-semibold">Ajouter au panier</Text>
      </TouchableOpacity>
    </View>
  );
}

import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import ProductCard from "./ProductCard";
import { fetchSimilarProducts } from "@/services/similarProducts"; // adapte le chemin si besoin

interface SimilarProductsProps {
  productId: number;
}

export default function SimilarProducts({ productId }: SimilarProductsProps) {
  const [produits, setProduits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await fetchSimilarProducts(productId);
        setProduits(data);
      } catch (error) {
        console.error("Erreur lors du chargement des produits similaires :", error);
      } finally {
        setLoading(false);
      }
    };

    if (productId) fetch();
  }, [productId]);

  if (loading) return null;
  if (produits.length === 0) return null;

  return (
    <View className="p-6">
      <Text className="text-xl font-bold mb-4 dark:text-white">Produits similaires</Text>
      <FlatList
        data={produits}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={(item) => item.id_produit.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

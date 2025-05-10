import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from '@/utils/supabase';
import { getProductImageUrl } from '@/services/productService';
import ProductImage from "@/components/ProductImage";
import { Link } from "expo-router";
import type { RelativePathString } from "expo-router";
export interface Produit {
  id_produit: number;
  nom: string;
  description: string;
  image_url: string;
}

export default function HomePage() {
  const [produits, setProduits] = useState<Produit[]>([]);

  useEffect(() => {
    const fetchProduits = async () => {
      const { data, error } = await supabase
        .from('produits')
        .select('id_produit, nom, description, image_url');

      if (error) {
        console.error('Erreur de récupération des produits:', error);
        return;
      }

      setProduits(data);
    };

    fetchProduits();
  }, []);

  return (
    <View className="flex-1 bg-white dark:bg-gray-800 px-4 py-6">
      <Text className="text-center text-2xl font-bold mb-6 dark:text-white">NOS SOLUTIONS</Text>
      <FlatList
        data={produits}
        numColumns={2}
        keyExtractor={(item) => item.id_produit.toString()}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => {
          const imageUrl = item.image_url ? getProductImageUrl(item.image_url) : null;

          return (
            <Link href={`/pages/product/${item.id_produit}` as RelativePathString} asChild>
              <TouchableOpacity className="w-[48%] bg-gray-100 dark:bg-slate-700 rounded-lg items-center justify-center p-4 mb-4 shadow-md">
                <ProductImage uri={imageUrl} />
                <Text className="text-center text-lg font-semibold dark:text-white">{item.nom}</Text>
              </TouchableOpacity>
            </Link>
          );
        }}
      />
    </View>
  );
}

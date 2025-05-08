import { Text, View, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from '@/utils/supabase';
import { getProductImageUrl } from '@/services/productService';
import ProductImage from "@/components/ProductImage";

export interface Produit {
  id_produit: number;
  nom: string;
  description: string;
  image_url: string;
}

export default function Index() {
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
    <View className="bg-white flex-1 items-center justify-center">
      <FlatList
        data={produits}
        keyExtractor={(item) => item.id_produit.toString()}
        renderItem={({ item }) => {
        const imageUrl = item.image_url ? getProductImageUrl(item.image_url) : null;

        return (
          <View className="p-4 border-b border-gray-300">
            <Text className="text-xl font-semibold">{item.nom}</Text>
            <Text className="text-sm text-gray-600">{item.description}</Text>

            <ProductImage uri={imageUrl} />
          </View>
        );
      }}
      />
    </View>
  );
}

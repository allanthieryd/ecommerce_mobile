import { Text, View, FlatList, Image } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from '@/utils/supabase';
import { getProductImageUrl } from '@/services/productService';

export interface Produit {
  id_produit: number;
  nom: string;
  description: string;
  image_url: string;
  image_public_url?: string;
  carousel: string; // à adapter si c'est un tableau JSON ou une chaîne encodée
}

export default function Index() {
  const [produits, setProduits] = useState<Produit[]>([]);

  useEffect(() => {
    const fetchProduits = async () => {
      const { data, error } = await supabase
        .from('produits')
        .select('id_produit, nom, description, image_url, carousel');
        
      if (error) {
        console.error('Erreur de récupération des produits:', error);
        return;
      }

      // Ajoute l'URL publique pour chaque image
      const produitsAvecUrl = data.map((produit) => ({
        ...produit,
        image_public_url: getProductImageUrl(produit.image_url),
      }));

      setProduits(produitsAvecUrl);
    };

    fetchProduits();
  }, []);

  return (
    <View className="bg-bg-alt flex-1 items-center justify-center">
      <FlatList
        data={produits}
        keyExtractor={(item) => item.id_produit.toString()}
        renderItem={({ item }) => (
          <View className="p-4 border-b border-gray-300">
            <Text className="text-xl font-semibold">{item.nom}</Text>
            <Text className="text-sm text-gray-600">{item.description}</Text>
            {item.image_public_url && (
              <Image
                source={{ uri: item.image_public_url }}
                className="w-32 h-32 rounded-md mt-2"
              />
            )}
            <Text className="mt-2">Carousel: {item.carousel}</Text>
          </View>
        )}
      />
    </View>
  );
}

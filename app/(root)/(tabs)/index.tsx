import { Text, View, FlatList, TouchableOpacity, TextInput } from "react-native";
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
  const [searchQuery, setSearchQuery] = useState(''); // État pour la barre de recherche
  const [filteredProduits, setFilteredProduits] = useState<Produit[]>([]); // Produits filtrés

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
      setFilteredProduits(data); // Initialiser les produits filtrés
    };

    fetchProduits();
  }, []);

  // Mettre à jour les produits filtrés en fonction de la recherche
  useEffect(() => {
    const filtered = produits.filter((produit) =>
      produit.nom.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProduits(filtered);
  }, [searchQuery, produits]);

  return (
    <View className="flex-1 bg-white px-4 py-6">
      <Text className="text-center text-2xl font-bold mb-6">OUR SOLUTIONS</Text>

      {/* Barre de recherche */}
      <TextInput
        className="bg-gray-200 rounded-lg px-4 py-2 mb-4"
        placeholder="Rechercher un produit..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      <FlatList
        data={filteredProduits} // Utiliser les produits filtrés
        numColumns={2}
        keyExtractor={(item) => item.id_produit.toString()}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        renderItem={({ item }) => {
          const imageUrl = item.image_url ? getProductImageUrl(item.image_url) : null;

          return (
            <TouchableOpacity className="w-[48%] bg-gray-100 rounded-lg items-center justify-center p-4 mb-4 shadow-md">
              <ProductImage uri={imageUrl} />
              <Text className="text-center text-lg font-semibold">{item.nom}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

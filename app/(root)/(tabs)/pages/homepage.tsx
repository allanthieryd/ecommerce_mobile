import { Text, View, FlatList, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { getProductImageUrl } from '@/services/productService';
import { fetchProducts } from '@/services/product';
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchQuery, setSearchQuery] = useState(''); // État pour la barre de recherche
  const [filteredProduits, setFilteredProduits] = useState<Produit[]>([]); // Produits filtrés

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchProducts();
        setProduits(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Mettre à jour les produits filtrés en fonction de la recherche
  useEffect(() => {
    const filtered = produits.filter((produit) =>
      produit.nom.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProduits(filtered);
  }, [searchQuery, produits]);

  return (
    <View className="flex-1 bg-white dark:bg-gray-800 px-4 py-6">
      <Text className="text-center text-2xl font-bold mb-6 dark:text-white">NOS SOLUTIONS</Text>
      <FlatList
        data={filteredProduits} // Utiliser les produits filtrés
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

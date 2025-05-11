import { Text, View, FlatList, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { supabase } from '@/utils/supabase';
import { getProductImageUrl } from '@/services/productService';
import ProductImage from "@/components/ProductImage";
import { Link } from "expo-router";
import type { RelativePathString } from "expo-router";

// Composant Checkbox personnalisé
const CustomCheckbox = ({ value, onValueChange }) => {
  return (
    <TouchableOpacity 
      onPress={onValueChange}
      className="w-5 h-5 border border-gray-400 rounded-sm justify-center items-center"
      style={{ backgroundColor: value ? "#6200ee" : "transparent" }}
    >
      {value && (
        <Text className="text-white text-xs font-bold">✓</Text>
      )}
    </TouchableOpacity>
  );
};

export interface Produit {
  id_produit: number;
  nom: string;
  description: string;
  image_url: string;
  categorie: string; // ID de la catégorie associée
}

// Modifiez l'interface Category pour correspondre à la structure réelle de votre table
export interface Category {
  id_categorie: string;  // Modifié de 'id' à 'id_categorie'
  nom: string;
}

export default function search() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProduits, setFilteredProduits] = useState<Produit[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Récupérer à la fois les produits et les catégories au chargement
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Récupérer les produits
        const { data: produitsData, error: produitsError } = await supabase
          .from('produits')
          .select('id_produit, nom, description, image_url, categorie');

        if (produitsError) {
          console.error('Erreur de récupération des produits:', produitsError);
          return;
        }

        // Récupérer les catégories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('id_categorie, nom');  // Modifié de 'id, nom' à 'id_categorie, nom'

        if (categoriesError) {
          console.error('Erreur de récupération des catégories:', categoriesError);
          return;
        }

        console.log('Produits récupérés:', produitsData.length);
        console.log('Catégories récupérées:', categoriesData.length);

        setProduits(produitsData);
        setFilteredProduits(produitsData);
        setCategories(categoriesData);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchData();
  }, []);

  // Filtrer les produits en fonction de la recherche et des catégories sélectionnées
  useEffect(() => {
    const filtered = produits.filter((produit) => {
      // Vérifier si le produit correspond à la recherche
      const matchesSearch = produit.nom.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Si aucune catégorie n'est sélectionnée, retourner simplement le résultat de la recherche
      if (selectedCategories.length === 0) {
        return matchesSearch;
      }
      
      // Vérifier si la catégorie du produit est parmi les catégories sélectionnées
      const matchesCategory = selectedCategories.includes(produit.categorie);
      
      return matchesSearch && matchesCategory;
    });
    
    console.log(`Filtrage: ${filtered.length} produits correspondant à la recherche et aux catégories sélectionnées`);
    setFilteredProduits(filtered);
  }, [searchQuery, selectedCategories, produits]);

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((cat) => cat !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const categoryName = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
  };

  // Afficher la correspondance entre les catégories du produit et les catégories disponibles
  const getCategoryName = (categorieId: string) => {
    const category = categories.find(cat => cat.id_categorie === categorieId); // Modifié de 'id' à 'id_categorie'
    return category ? category.nom : categorieId;
  };

  return (
    <View className="flex-1 bg-white dark:bg-gray-800">
      {/* Header fixe contenant le titre, la recherche et les filtres */}
      <View className="bg-white dark:bg-gray-800 px-4 py-2 z-10 shadow-sm">
        <Text className="text-center text-2xl font-bold mb-4 dark:text-white">NOS SOLUTIONS</Text>
        
        {/* Barre de recherche */}
        <TextInput
          className="bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 mb-2"
          placeholder="Rechercher un produit..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Filtres par catégorie avec checkbox personnalisée */}
        <ScrollView horizontal className="h-10 mb-2 py-1">
          {categories.map((category) => (
            <View 
              key={category.id_categorie} // Modifié de 'id' à 'id_categorie'
              className={`flex-row items-center mr-4 px-3 py-1 rounded-full ${
                selectedCategories.includes(category.id_categorie) // Modifié de 'id' à 'id_categorie'
                  ? 'bg-purple-100 dark:bg-purple-900' 
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              <CustomCheckbox
                value={selectedCategories.includes(category.id_categorie)} // Modifié de 'id' à 'id_categorie'
                onValueChange={() => toggleCategory(category.id_categorie)} // Modifié de 'id' à 'id_categorie'
              />
              <Text 
                className={`ml-2 ${
                  selectedCategories.includes(category.id_categorie) // Modifié de 'id' à 'id_categorie'
                    ? 'font-medium text-purple-800 dark:text-purple-200' 
                    : 'text-gray-800 dark:text-white'
                }`}
              >
                {categoryName(category.nom)}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Liste des produits qui défile sous le header fixe */}
      <FlatList
        className="px-4 pt-2"
        data={filteredProduits}
        numColumns={2}
        keyExtractor={(item) => item.id_produit.toString()}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center mt-10">
            <Text className="text-gray-500 dark:text-gray-400 text-lg">
              Aucun produit trouvé
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const imageUrl = item.image_url ? getProductImageUrl(item.image_url) : null;

          return (
            <Link href={`/pages/product/${item.id_produit}` as RelativePathString} asChild>
              <TouchableOpacity className="w-[48%] bg-gray-100 dark:bg-slate-700 rounded-lg items-center justify-center p-4 mb-4 shadow-md">
                <ProductImage uri={imageUrl} />
                <Text className="text-center text-lg font-semibold dark:text-white">{item.nom}</Text>
                <Text className="text-center text-xs text-gray-500 dark:text-gray-400">
                  {getCategoryName(item.categorie)}
                </Text>
              </TouchableOpacity>
            </Link>
          );
        }}
      />
    </View>
  );
}
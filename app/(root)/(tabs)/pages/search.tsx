/* eslint-disable react-hooks/rules-of-hooks */
import { Text, View, FlatList, TouchableOpacity, TextInput, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import { getProductImageUrl } from '@/services/productService';
import ProductImage from "@/components/ProductImage";
import { Link } from "expo-router";
import { fetchProducts } from '@/services/product';
import { getCategories } from '@/services/category';

// Définition des interfaces
interface Product {
  id_produit: number;
  categorie: number;
  nom: string;
  description: string;
  tarif_utilisateur: number;
  tarif_mensuel: number;
  tarif_annuel: number;
  tarif_appareil: number;
  image_url?: string;
  detail?: string;
  carousel?: string[];
  date_creation: string;
  date_modification: string;
}

interface Category {
  id_categorie: number;
  nom: string;
  description: string;
  date_creation: string;
  date_modification: string;
  image_url?: string;
  detail?: string;
}

interface CustomCheckboxProps {
  value: boolean; // Le 'value' est un booléen
  onValueChange: (newValue: boolean) => void; // La fonction prend un booléen et ne retourne rien
}

// Composant CustomCheckbox pour une meilleure sémantique
const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ value, onValueChange }) => {
  return (
    <TouchableOpacity
      onPress={() => onValueChange(!value)} // Inverse l'état lors du clic
      className="w-5 h-5 border border-gray-400 rounded-sm justify-center items-center"
      style={{ backgroundColor: value ? "#6200ee" : "transparent" }}
    >
      {value && (
        <Text className="text-white text-xs font-bold">✓</Text>
      )}
    </TouchableOpacity>
  );
};


const Search = () => {
  const [produits, setProduits] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProduits, setFilteredProduits] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Récupération des produits
        const produitsData = await fetchProducts({ searchQuery });
        setProduits(produitsData || []);
        
        // Récupération des catégories
        const categoriesData = await getCategories();
        setCategories(categoriesData || []);
        
        // Initialisation des produits filtrés
        setFilteredProduits(produitsData || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchData();
  }, [searchQuery]);  // Ajout de searchQuery dans les dépendances

  // Filtrage des produits selon la recherche et les catégories sélectionnées
  useEffect(() => {
    const filtered = produits.filter((produit) => {
      // Vérifier si le produit correspond à la recherche
      const matchesSearch = produit.nom.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Si aucune catégorie n'est sélectionnée, afficher tous les produits qui correspondent à la recherche
      if (selectedCategories.length === 0) {
        return matchesSearch;
      }

      // Vérifier si le produit appartient à une des catégories sélectionnées
      const matchesCategory = selectedCategories.includes(produit.categorie);
      return matchesSearch && matchesCategory;
    });
    
    setFilteredProduits(filtered);
  }, [searchQuery, selectedCategories, produits]);

  // Fonction pour basculer la sélection d'une catégorie
  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((cat) => cat !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Formatage du nom de catégorie avec première lettre en majuscule
  const formatCategoryName = (categoryName: string): string => {
    if (!categoryName) return "";
    return categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase();
  };

  // Récupération du nom d'une catégorie par son ID
  const getCategoryName = (categorieId: number): string => {
    const category = categories.find(cat => cat.id_categorie === categorieId);
    return category ? category.nom : "Autre";
  };

  return (
    <View className="flex-1 bg-white dark:bg-gray-800">
      {/* Header avec recherche et filtres */}
      <View className="bg-white dark:bg-gray-800 px-4 py-2 z-10 shadow-sm">
        <Text className="text-center text-2xl font-bold mb-4 dark:text-white">NOS SOLUTIONS</Text>
        
        {/* Champ de recherche */}
        <TextInput
          className="bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg px-4 py-2 mb-2"
          placeholder="Rechercher un produit..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />

        {/* Liste des catégories */}
        <ScrollView horizontal className="h-10 mb-2 py-1">
          {categories.map((category) => (
            <View 
              key={category.id_categorie} 
              className={`flex-row items-center mr-4 px-3 py-1 rounded-full ${
                selectedCategories.includes(category.id_categorie) 
                  ? 'bg-purple-100 dark:bg-purple-900' 
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              <CustomCheckbox
                value={selectedCategories.includes(category.id_categorie)}
                onValueChange={() => toggleCategory(category.id_categorie)}
              />
              <Text 
                className={`ml-2 ${
                  selectedCategories.includes(category.id_categorie) 
                    ? 'font-medium text-purple-800 dark:text-purple-200' 
                    : 'text-gray-800 dark:text-white'
                }`}
              >
                {formatCategoryName(category.nom)}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Liste des produits */}
      <FlatList
        className="px-4 pt-2"
        data={filteredProduits}
        numColumns={2}
        keyExtractor={(item) => item.id_produit.toString()}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center mt-10">
            <Text className="text-gray-500 dark:text-gray-400 text-lg">
              {isLoading ? "Chargement..." : "Aucun produit trouvé"}
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const imageUrl = item.image_url ? getProductImageUrl(item.image_url) : null;

          return (
            <Link href={`/pages/product/${item.id_produit}`} asChild>
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
};

export default Search;
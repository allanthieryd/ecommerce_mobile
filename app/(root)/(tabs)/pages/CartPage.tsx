import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const CartPage = () => {
  const router = useRouter();

  // Exemple de données du panier
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Data Secure Pack", price: 1499 },
    { id: 2, name: "Cyber Monitoring", price: 1499 },
    { id: 3, name: "EDR Software", price: 1499 },
  ]);

  // Fonction pour supprimer un article du panier
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <View className="flex-1 bg-white">
      {/* En-tête */}
      <View className="flex-row items-center px-4 py-4 bg-white shadow-md">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black ml-4">Mes commandes</Text>
      </View>

      {/* Liste des articles */}
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="flex-row items-center justify-between bg-gray-200 rounded-lg p-4 m-4">
            <View>
              <Text className="text-black text-lg">{item.name}</Text>
              <Text className="text-gray-600">${item.price}</Text>
            </View>
            <TouchableOpacity onPress={() => removeItem(item.id)}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-8">
            Votre panier est vide.
          </Text>
        }
      />

      {/* Bouton pour procéder au paiement */}
      {cartItems.length > 0 && (
        <TouchableOpacity className="bg-purple-500 py-4 mx-4 rounded-md items-center">
          <Text className="text-white text-lg font-bold">
            Procéder au paiement
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CartPage;
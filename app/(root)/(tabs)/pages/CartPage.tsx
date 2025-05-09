import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { supabase } from "@/utils/supabase"

interface CartItem {
  articleId: number
  productId: number
  productName: string
  quantity: number
  productPrice: number
}

const CartPage = () => {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [quantityInputs, setQuantityInputs] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    setLoading(true)
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !sessionData.session) throw new Error("Non authentifié.")
      const userId = sessionData.session.user.id

      const { data: cart, error } = await supabase
        .from("panier")
        .select("id_article, id_produit, quantite, prix_unitaire, nom")
        .eq("id_utilisateur", userId)

      if (error) throw error

      const formatted = cart.map((item) => ({
        articleId: item.id_article,
        productId: item.id_produit,
        productName: item.nom,
        quantity: item.quantite,
        productPrice: item.prix_unitaire,
      }))

      setCartItems(formatted)

      // Initialiser les inputs
      const inputs: Record<number, string> = {}
      formatted.forEach((item) => {
        inputs[item.productId] = item.quantity.toString()
      })
      setQuantityInputs(inputs)
    } catch (err) {
      Alert.alert("Erreur", "Impossible de charger le panier.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (productId: number, value: string) => {
    setQuantityInputs((prev) => ({
      ...prev,
      [productId]: value,
    }))
  }

  const handleQuantityUpdate = (productId: number, inputValue: string) => {
    const newQuantity = parseInt(inputValue)
    if (isNaN(newQuantity) || newQuantity < 1) {
      const currentItem = cartItems.find((item) => item.productId === productId)
      if (currentItem) {
        setQuantityInputs((prev) => ({
          ...prev,
          [productId]: currentItem.quantity.toString(),
        }))
      }
      return
    }

    const updatedCart = cartItems.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    )
    setCartItems(updatedCart)
  }

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.productPrice * item.quantity,
    0
  )

  return (
    <View className="flex-1 bg-white">
      <View className="flex-row items-center px-4 py-4 bg-white shadow-md">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back-outline" size={24} color="black" />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black ml-4">Mon panier</Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6B21A8" />
        </View>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.articleId.toString()}
          renderItem={({ item }) => (
            <View className="flex-row items-center justify-between bg-gray-200 rounded-lg p-4 m-4">
              <View className="flex-1 pr-2">
                <Text className="text-black text-lg">{item.productName}</Text>
                <View className="flex-row items-center mt-1">
                  <TextInput
                    className="bg-white border border-gray-300 rounded px-2 py-1 w-16 text-center mr-2"
                    keyboardType="number-pad"
                    value={quantityInputs[item.productId] || ""}
                    onChangeText={(text) => handleInputChange(item.productId, text)}
                    onBlur={() => {
                      handleQuantityUpdate(item.productId, quantityInputs[item.productId])
                      Keyboard.dismiss()
                    }}
                  />
                  <Text className="text-gray-600">× {item.productPrice} €</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {!loading && cartItems.length > 0 && (
        <View className="px-4 pb-6">
          <Text className="text-right text-lg font-semibold mb-2">
            Total : {totalPrice.toFixed(2)} €
          </Text>
          <TouchableOpacity className="bg-purple-500 py-4 rounded-md items-center">
            <Text className="text-white text-lg font-bold">Procéder au paiement</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

export default CartPage

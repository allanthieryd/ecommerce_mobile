import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { supabase } from "@/utils/supabase"
import BackArrow from "@/components/BackArrow"
import { fetchCart, updateCartItem, deleteCartItem } from "@/services/cart"
import { useFocusEffect } from "expo-router"
import { useCallback } from "react"

interface CartItem {
  articleId: number
  commandId: number
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [userInfo, setUserInfo] = useState<{ nom: string; prenom: string; email: string } | null>(null)

  useFocusEffect(
    useCallback(() => {
      loadCart()
    }, [])
  )  

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  
        if (sessionError || !sessionData?.session?.user) {
          router.push("/auth/SignInPage")
          return
        }
  
        const user = sessionData.session.user
  
        const { data: userData, error } = await supabase
          .from("utilisateurs")
          .select("nom, prenom, email")
          .eq("id_utilisateur", user.id)
          .single()
  
        if (error) throw new Error("Erreur lors de la récupération des informations utilisateur.")
  
        setUserInfo(userData)
      } catch (error) {
        console.error("Erreur lors de la récupération des données utilisateur :", error)
      }
    }
  
    fetchUserData()
  }, [router])
  


  useEffect(() => {
    loadCart()
  }, [])

  const loadCart = async () => {
    setLoading(true)
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
      if (sessionError || !sessionData.session) throw new Error("Non authentifié.")
      const userId = sessionData.session.user.id

      const rawCart = await fetchCart(userId)
      
      // Vérifier si rawCart contient des données
      if (!rawCart || rawCart.length === 0) {
        setCartItems([])
        setLoading(false)
        return
      }

      // console.log("Données brutes du panier:", JSON.stringify(rawCart, null, 2))
      
      // Mapper les données avec les bons noms de champs
      const formatted = rawCart
        .filter((item: any) => {
          // Vérifier que les propriétés nécessaires existent
          if (!item || !item.id_produit) {
            console.warn("Article invalide:", item)
            return false
          }
          return true
        })
        .map((item: any) => {
          // Créer un objet CartItem avec toutes les propriétés nécessaires
          const cartItem = {
            articleId: item.id_article || 0,
            commandId: item.id_commande || 0,
            productId: item.id_produit,
            productName: item.nom || "Produit sans nom",
            quantity: item.quantite || 1,
            productPrice: item.prix_unitaire || 0
          }
          return cartItem
        })

      // console.log("Panier formaté:", formatted)
      setCartItems(formatted)

      // Initialiser les inputs avec les quantités
      const inputs: Record<number, string> = {}
      formatted.forEach((item) => {
        if (item.productId && item.quantity) {
          inputs[item.productId] = item.quantity.toString()
        }
      })
      setQuantityInputs(inputs)
    } catch (err) {
      Alert.alert("Erreur", "Impossible de charger le panier.")
      console.error("Erreur loadCart:", err)
    } finally {
      setLoading(false)
    }
  }
  
  const handleInputChange = (productId: number, value: string) => {
    if (!productId) return
    setQuantityInputs((prev) => ({
      ...prev,
      [productId]: value,
    }))
  }

  const handleQuantityUpdate = async (productId: number, inputValue: string) => {
    if (!productId) return
    
    const newQuantity = parseInt(inputValue)
  
    const currentItem = cartItems.find((item) => item.productId === productId)
    if (!currentItem) {
      console.warn("Article introuvable pour productId:", productId)
      return
    }
  
    if (isNaN(newQuantity) || newQuantity < 1) {
      // Rétablir la valeur précédente
      setQuantityInputs((prev) => ({
        ...prev,
        [productId]: currentItem.quantity.toString(),
      }))
      return
    }
  
    try {
      // Déterminer quel ID utiliser pour la mise à jour
      const updateId = currentItem.commandId || currentItem.articleId
      if (!updateId) {
        console.error("ID de commande manquant pour la mise à jour")
        return
      }
      
      await updateCartItem({ id_produit: updateId, quantite: newQuantity })
  
      const updatedCart = cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      )
      setCartItems(updatedCart)
    } catch (error) {
      Alert.alert("Erreur", "La mise à jour du panier a échoué.")
      console.error("Erreur de mise à jour:", error)
    }
  }
  
  const handleDeleteItem = async (commandId: number, productId: number) => {
    if (!commandId || !productId) {
      console.error("IDs manquants pour la suppression:", { commandId, productId })
      return
    }
    
    try {
      await deleteCartItem(commandId, productId)
      setCartItems((prev) =>
        prev.filter(
          (item) =>
            !(item.commandId === commandId && item.productId === productId)
        )
      )
    } catch (err) {
      Alert.alert("Erreur", "Impossible de supprimer le produit.")
      console.error("Erreur de suppression:", err)
    }
  }

  const totalPrice = cartItems.reduce(
    (acc, item) => acc + (item.productPrice || 0) * (item.quantity || 0),
    0
  )

  return (
    <View className="flex-1 bg-white dark:bg-gray-800">
      <View className="flex-row items-center px-4 py-4 bg-white dark:bg-gray-800 shadow-md dark:border-b dark:border-gray-900">
        <TouchableOpacity onPress={() => router.back()}>
          <BackArrow />
        </TouchableOpacity>
        <Text className="text-xl font-bold text-black dark:text-white ml-4">Mon panier</Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#6B21A8" />
        </View>
      ) : cartItems.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-black dark:text-white text-lg">Votre panier est vide</Text>
          <TouchableOpacity 
            className="bg-purple-500 py-3 px-4 rounded-md items-center mt-4"
            onPress={() => router.push("/")}
          >
            <Text className="text-white">Continuer mes achats</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item, index) => `${item.productId}-${index}`}
          renderItem={({ item }) => (
            <View className="flex-row items-center justify-between bg-gray-200 dark:bg-slate-700 rounded-lg p-4 m-4">
              <View className="flex-1 pr-2">
                <Text className="text-black dark:text-white text-lg">{item.productName}</Text>
                <View className="flex-row items-center mt-1">
                  <TextInput
                    className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-slate-500 rounded px-2 py-1 w-16 text-center mr-2 dark:text-white"
                    keyboardType="number-pad"
                    value={quantityInputs[item.productId] || item.quantity.toString()}
                    onChangeText={(text) => handleInputChange(item.productId, text)}
                    onBlur={() => {
                      handleQuantityUpdate(item.productId, quantityInputs[item.productId])
                      Keyboard.dismiss()
                    }}
                  />
                  <Text className="text-gray-600 dark:text-white">× {item.productPrice} €</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => handleDeleteItem(item.commandId, item.productId)}>
                <Ionicons name="trash-outline" size={24} color="red" />
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {!loading && cartItems.length > 0 && (
        <View className="px-4 pb-6">
          <Text className="text-right text-lg font-semibold mb-2 dark:text-white">
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
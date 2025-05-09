import { useState, useEffect } from "react"
import { supabase } from "@/utils/supabase"
import { View, Text, TextInput, Pressable } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons";

const Account = () => {
  const [userInfo, setUserInfo] = useState<{ nom: string; prenom: string; email: string } | null>(null)
  const router = useRouter()

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
  

  return (
    <View className="flex-1 p-4 bg-gray-100 justify-center">
      <Text className="text-3xl font-semibold text-center mb-6">Mon Compte</Text>
      {userInfo ? (
        <View className="bg-white p-4 rounded-lg shadow-lg">
          <View className="mb-4">
            <Text className="text-lg font-medium">Nom</Text>
            <TextInput
              value={userInfo.nom}
              editable={false}
              className="p-2 border border-gray-300 rounded-md bg-gray-100 text-black"
            />
          </View>

          <View className="mb-4">
            <Text className="text-lg font-medium">Prénom</Text>
            <TextInput
              value={userInfo.prenom}
              editable={false}
              className="p-2 border border-gray-300 rounded-md bg-gray-100 text-black"
            />
          </View>

          <View className="mb-4">
            <Text className="text-lg font-medium">Email</Text>
            <TextInput
              value={userInfo.email}
              editable={false}
              className="p-2 border border-gray-300 rounded-md bg-gray-100 text-black"
            />
          </View>
          <View className="mb-4">
          <Pressable
            onPress={() => {}}
            className="bg-gray-800 py-3 px-4 rounded-md flex-row items-center justify-center"
            >
            <Ionicons name="settings" size={20} color="white" className="mr-2" />
            <Text className="text-white text-base font-medium">Modifier mes informations</Text>
          </Pressable>
          </View>
          <View className="mb-4">
          <Pressable
            onPress={() => {}}
            className="bg-gray-800 py-3 px-4 rounded-md flex-row items-center justify-center"
            >
            <Ionicons name="flag" size={20} color="white" className="mr-2" />
            <Text className="text-white text-base font-medium">Changer la langue</Text>
          </Pressable>
          </View>
          <Pressable
            onPress={() => {}}
            className="bg-gray-800 py-3 px-4 rounded-md flex-row items-center justify-center"
            >
            <Ionicons name="moon" size={20} color="white" className="mr-2" />
            <Text className="text-white text-base font-medium">Changer l'apparence</Text>
          </Pressable>

        </View>
      ) : (
        <Text className="text-center text-gray-600 mt-4">Aucune information utilisateur trouvée.</Text>
      )}
    </View>
  )
}

export default Account

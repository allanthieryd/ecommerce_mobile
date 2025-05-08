// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useState, useEffect } from "react"
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { supabase } from "@/utils/supabase"
import { View, Text, TextInput, Button } from "react-native"

const settings = () => {
  return (
    <View className="flex-1 p-4 bg-gray-100 justify-center">
      <Text className="text-3xl font-semibold text-center mb-6">Mon Compte</Text>
        <View className="bg-white p-4 rounded-lg shadow-lg">
          <View className="mb-4">
            <Text className="text-lg font-medium">Nom</Text>
            <TextInput
              value={""}
              editable={false}
              className="p-2 border border-gray-300 rounded-md bg-gray-100 text-black"
            />
          </View>

          <View className="mb-4">
            <Text className="text-lg font-medium">Prénom</Text>
            <TextInput
              value={""}
              editable={false}
              className="p-2 border border-gray-300 rounded-md bg-gray-100 text-black"
            />
          </View>

          <View className="mb-4">
            <Text className="text-lg font-medium">Email</Text>
            <TextInput
              value={""}
              editable={false}
              className="p-2 border border-gray-300 rounded-md bg-gray-100 text-black"
            />
          </View>

          <Button title="Modifier mes informations" onPress={() => {}} />
        </View>
        <Text className="text-center text-gray-600">Aucune information utilisateur trouvée.</Text>
    </View>
  );
};

export default settings;

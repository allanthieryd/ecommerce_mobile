import { useState } from "react";
import { Image, View, Text } from "react-native";

interface ProductImageProps {
  uri: string | null;
}

export default function ProductImage({ uri }: ProductImageProps) {
  const [error, setError] = useState(false);

  if (!uri || error) {
    return (
      <View className="w-32 h-32 rounded-md mt-2 bg-gray-200 items-center justify-center">
        <Text className="text-gray-500 text-xs text-center">
          Image non disponible
        </Text>
      </View>
    );
  }

  return (
    <Image
      source={{ uri }}
      className="w-32 h-32 rounded-md mt-2"
      onError={() => setError(true)}
    />
  );
}

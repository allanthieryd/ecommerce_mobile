import { useState } from "react";
import { Image, View, Text } from "react-native";

interface ProductImageProps {
  uri: string | null;
}

export default function ProductImageCarousel({ uri }: ProductImageProps) {
  const [error, setError] = useState(false);

  if (!uri || error) {
    return (
    <View className="w-full h-[200px] items-center justify-center">
        <View className="w-52 h-52 rounded-md bg-gray-200 items-center justify-center">
          <Text className="text-gray-500 text-xs text-center">
            Image non disponible
          </Text>
        </View>
    </View>
    );
  }

  return (
    <View>
      <Image
        source={{ uri }}
        resizeMode="contain"
        style={{ width: '100%', height: 200, }} // nécessaire ici
        onError={() => setError(true)}
      />
    </View>
  );
}

// components/ProductCarousel.tsx
import { FlatList, Image, Dimensions } from "react-native";

interface ProductCarouselProps {
  images: string[];
}

const { width } = Dimensions.get("window");

export default function ProductCarousel({ images }: ProductCarouselProps) {
  return (
    <FlatList
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      data={images}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <Image
          source={{ uri: item }}
          style={{ width, height: 250, resizeMode: "cover" }}
        />
      )}
    />
  );
}

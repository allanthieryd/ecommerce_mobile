import { Pressable, StyleProp, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
};

export default function HeaderButton({ icon, color, style, onPress }: Props) {
  return (
    <Pressable
      style={[style, { padding: 5, borderRadius: "50%" }]}
      onPress={onPress}
    >
      <Ionicons name={icon} color={color} size={20} />
    </Pressable>
  );
}

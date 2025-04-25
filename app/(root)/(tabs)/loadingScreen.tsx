import { Text, View, Image } from "react-native";

export default function loadingScreen() {
  return (
    <View className="bg-bg-alt flex-1 items-center justify-center">
        <Image
        source={require("@/assets/images/IconLoad.png")}
        className="w-40 h-40 animate-slow_spin"
        />
    </View>
  );
}
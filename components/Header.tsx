import { View, Text } from "react-native";
import type { BottomTabHeaderProps } from "@react-navigation/bottom-tabs";
import type { TabScreenOptions } from "@/app/(root)/(tabs)/_layout";
import HeaderButton from "./HeaderButton";

type Props = {
  TabScreens: TabScreenOptions[];
  screen: BottomTabHeaderProps;
};

export default function Header({ TabScreens, screen }: Props) {
  return (
    <View className="bg-bg-default flex w-full h-16 justify-center">
      <View>
        <Text className="font-Rubik text-white text-2xl pl-4">
          {TabScreens.find(
            (tab) => tab.name.toLowerCase() === screen.route.name.toLowerCase(),
          )?.title || "hmm"}
        </Text>
      </View>
      <View
        style={{
          position: "absolute",
          right: 20,
          flexDirection: "row",
        }}
      >
        <HeaderButton icon="ellipsis-vertical-sharp" color={"#fff"} />
      </View>
    </View>
  );
}

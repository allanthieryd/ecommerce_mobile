import { Tabs } from "expo-router";
import type { Ionicon } from "@/types/Ionicon";
import { Ionicons } from "@expo/vector-icons";
import Header from "@/components/Header";

export type TabScreenOptions = {
  name: Lowercase<string>;
  title: string;
  icon: Ionicon;
};

export default function RootLayout() {
  const TabScreens: TabScreenOptions[] = [
    { name: "pages/homepage", title: "Accueil", icon: "home" },
    { name: "pages/search", title: "Search", icon: "search" },
    { name: "pages/account", title: "Account", icon: "person" },
    { name: "pages/cartpage", title: "Panier", icon: "cart" },
  ];
  return (
    <Tabs
      screenOptions={{
        header: (screen) => {
          return <Header TabScreens={TabScreens} screen={screen} />;
        },
        tabBarStyle: {
          backgroundColor: "#000015",
          borderTopWidth: 0,
        },
      }}
    >
      {TabScreens.map((screen) => {
        return (
          <Tabs.Screen
            name={screen.name}
            options={{
              title: screen.title,
              tabBarIcon: ({ focused }) => (
                <Ionicons
                  // @ts-ignore
                  name={focused ? screen.icon : `${screen.icon}-outline`}
                  color={focused ? "#3A81F5" : "#B3B3B3"}
                  size={22}
                />
              ),
            }}
            key={screen.name}
          />
        );
      })}
    </Tabs>
  );
}

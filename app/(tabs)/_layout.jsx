import { Tabs } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#f8f8ff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 65,
          position: "absolute",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: -2 },
          elevation: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          marginBottom: 5,
        },
      }}
    >
      <Tabs.Screen name="index"
      options={{
        tabBarLabel: 'Home',
        tabBarIcon:({color,size}) => (
          <FontAwesome name="home" size={24} color={color} />
        )
      }}
      />
      <Tabs.Screen name="History"
      options={{
        tabBarLabel: 'History',
        tabBarIcon:({color,size}) => (
          <FontAwesome name="history" size={24} color={color} />
        )
      }}
      />
      <Tabs.Screen name="Profile"
      options={{
        tabBarLabel: 'Profile',
        tabBarIcon:({color,size}) => (
          <FontAwesome name="user" size={24} color={color} />
      )
      }}
      />
    </Tabs>
  );
}

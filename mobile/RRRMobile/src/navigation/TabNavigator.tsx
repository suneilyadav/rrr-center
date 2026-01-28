import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";

import FeedScreen from "../screens/FeedScreen";
import ShareScreen from "../screens/ShareScreen";
import ClaimsScreen from "../screens/ClaimsScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarStyle: {
          height: 65,
          paddingBottom: 8,
          paddingTop: 6,
        },

        // ✅ Custom Icons + Colors
        tabBarIcon: ({ focused }) => {
          let iconName = "";
          let iconColor = "gray";

          if (route.name === "Feed") {
            iconName = "home";
            iconColor = focused ? "blue" : "gray";
          }

          if (route.name === "Share") {
            iconName = "add-circle";
            iconColor = focused ? "green" : "gray";
          }

          if (route.name === "Claims") {
            iconName = "clipboard";
            iconColor = focused ? "orange" : "gray";
          }

          if (route.name === "Profile") {
            iconName = "person";
            iconColor = focused ? "purple" : "gray";
          }

          return (
            <Ionicons name={iconName} size={28} color={iconColor} />
          );
        },
      })}
    >
      <Tab.Screen name="Feed" component={FeedScreen} />
      <Tab.Screen name="Share" component={ShareScreen} />
      <Tab.Screen name="Claims" component={ClaimsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}


import React, { useEffect } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import SplashScreen from "./src/screens/SplashScreen";
import AuthScreen from "./src/screens/AuthScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SignupScreen from "./src/screens/SignupScreen";
import TabNavigator from "./src/navigation/TabNavigator";

// ✅ Google Sign-In Configure
import { GoogleSignin } from "@react-native-google-signin/google-signin";

const Stack = createNativeStackNavigator();

export default function App() {
  // ✅ Configure Google Sign-In Once App Loads
useEffect(() => {
  GoogleSignin.configure({
    webClientId:
      "725378297726-iab77152fru03o832kmjagcl8t277m7d.apps.googleusercontent.com",
  });
}, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="Home" component={TabNavigator} />
        <Stack.Screen name="Signup" component={SignupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


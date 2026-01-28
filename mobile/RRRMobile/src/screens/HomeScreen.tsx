import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function HomeScreen({ navigation }: any) {
  const [userName, setUserName] = useState("");

  // ✅ Load user data
  useEffect(() => {
    const loadUser = async () => {
      const savedUser = await AsyncStorage.getItem("user");

      if (savedUser) {
        const userObj = JSON.parse(savedUser);
        setUserName(userObj?.user?.name || "User");
      }
    };

    loadUser();
  }, []);

  // ✅ Logout Function
  const handleLogout = async () => {
    await GoogleSignin.signOut();
    await AsyncStorage.removeItem("user");

    navigation.replace("Auth");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome 👋</Text>

      <Text style={styles.subtitle}>
        {userName}, you are logged in successfully!
      </Text>

      <Text style={styles.tagline}>
        ❤️ Share More. Waste Less. ♻️
      </Text>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f8f3",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "900",
    color: "#0f2d1e",
  },

  subtitle: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
    color: "#2e4a3a",
    fontWeight: "600",
  },

  tagline: {
    fontSize: 15,
    marginTop: 18,
    color: "#1b5e20",
    fontWeight: "700",
  },

  logoutBtn: {
    marginTop: 40,
    backgroundColor: "#d32f2f",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 16,
  },

  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
});


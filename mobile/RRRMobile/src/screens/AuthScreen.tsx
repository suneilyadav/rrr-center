import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from "react-native";

import { GoogleSignin } from "@react-native-google-signin/google-signin";

import AsyncStorage from "@react-native-async-storage/async-storage";

import api from "../api/api";

export default function AuthScreen({ navigation }: any) {
  // ✅ Google Login Function
  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();

      // ✅ Login Popup
      const userInfo = await GoogleSignin.signIn();

      console.log(
        "FULL GOOGLE RESPONSE:",
        JSON.stringify(userInfo, null, 2)
      );

      // ✅ Safe Email Extract
      const email =
        userInfo?.user?.email ||
        userInfo?.data?.user?.email;

      if (!email) {
        Alert.alert("Login Failed ❌", "Email not found");
        return;
      }

      // ✅ Fetch all registered users
      const res = await api.get("/api/users");

      const existingUser = res.data.find(
        (u: any) => u.email === email
      );

      // ✅ अगर user पहले से registered है → सीधे Home
      if (existingUser) {
        await AsyncStorage.setItem(
          "user",
          JSON.stringify(existingUser)
        );

        Alert.alert("Login Successful ✅", "Welcome to RRR Center!");
        navigation.replace("Home");
        return;
      }

      // ❌ नया user → Signup
      Alert.alert("New User 👤", "Please complete registration");
      navigation.replace("Signup", { googleUser: userInfo });
    } catch (error: any) {
      console.log("❌ Google Login Error:", error);

      Alert.alert(
        "Login Failed ❌",
        error?.message || "Unknown Error"
      );
    }
  };

  return (
    <View style={styles.container}>
      {/* Card */}
      <View style={styles.card}>
        {/* Logo */}
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
        />

        {/* Heading */}
        <Text style={styles.title}>RRR Center</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>
          Narmadapuram Municipal Council
        </Text>

        {/* Tagline */}
        <Text style={styles.tagline}>
          ❤️ Share More. Waste Less. ♻️
        </Text>

        {/* Google Login Button */}
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
        >
          <Image
            source={{
              uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/512px-Google_%22G%22_Logo.svg.png",
            }}
            style={styles.googleIcon}
          />

          <Text style={styles.buttonText}>
            Continue with Google
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © Narmadapuram Municipal Council
        </Text>
        <Text style={styles.footerSub}>
          powered by @ nea solutions
        </Text>
      </View>
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

  card: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: "#ffffff",
    borderRadius: 24,
    paddingVertical: 35,
    paddingHorizontal: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },

  logo: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginBottom: 20,
  },

  title: {
    fontSize: 34,
    fontWeight: "900",
    color: "#0f2d1e",
  },

  subtitle: {
    fontSize: 14,
    color: "#4d6b57",
    marginTop: 6,
    fontWeight: "600",
  },

  tagline: {
    fontSize: 15,
    marginTop: 18,
    color: "#1b5e20",
    fontWeight: "700",
  },

  googleButton: {
    marginTop: 35,
    width: "100%",
    backgroundColor: "#1b5e20",
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  googleIcon: {
    width: 22,
    height: 22,
    marginRight: 10,
    backgroundColor: "white",
    borderRadius: 6,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "800",
    color: "white",
  },

  footer: {
    marginTop: 35,
    alignItems: "center",
  },

  footerText: {
    fontSize: 12,
    color: "#777",
  },

  footerSub: {
    fontSize: 11,
    marginTop: 4,
    color: "#999",
  },
});


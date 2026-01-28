import React, { useEffect, useRef } from "react";
import { View, Text, Animated, Image } from "react-native";

// ✅ AsyncStorage for Persistent Login
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SplashScreen({ navigation }: any) {
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Fade + Slide animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse Animation for Logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // ✅ Check Login Status after 3 sec
    setTimeout(async () => {
      const user = await AsyncStorage.getItem("user");

      if (user) {
        // ✅ Already Logged In → Go Home
        navigation.replace("Home");
      } else {
        // ❌ Not Logged In → Go Auth
        navigation.replace("Auth");
      }
    }, 3000);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#ffffff",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Top City Name */}
      <Animated.Text
        style={{
          position: "absolute",
          top: 90,
          fontSize: 28,
          fontWeight: "900",
          letterSpacing: 4,
          color: "#1b5e20",
          opacity: fadeAnim,
        }}
      >
        NARMADAPURAM
      </Animated.Text>

      {/* Animated Logo Pulse */}
      <Animated.View
        style={{
          transform: [{ scale: pulseAnim }],
          opacity: fadeAnim,
        }}
      >
        <Image
          source={require("../assets/logo.png")}
          style={{
            width: 260,
            height: 260,
            resizeMode: "contain",
          }}
        />
      </Animated.View>

      {/* Bottom Tagline Slide Up */}
      <Animated.View
        style={{
          position: "absolute",
          bottom: 90,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          alignItems: "center",
        }}
      >
        {/* Main Line */}
        <Text
          style={{
            fontSize: 18,
            fontWeight: "700",
            color: "#222",
            textAlign: "center",
          }}
        >
          ❤️ Share More. Waste Less. ♻️
        </Text>

        {/* Sub Line */}
        <Text
          style={{
            fontSize: 13,
            color: "#666",
            marginTop: 8,
            textAlign: "center",
          }}
        >
          Share • Claim • Reuse — Together for a Greener City
        </Text>
      </Animated.View>
    </View>
  );
}


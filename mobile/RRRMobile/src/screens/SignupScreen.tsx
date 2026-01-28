import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SignupScreen({ route, navigation }: any) {
  const { googleUser } = route.params;

  const [phone, setPhone] = useState("");
  const [ward, setWard] = useState("");
  const [address, setAddress] = useState("");

const handleRegister = async () => {
  const user = googleUser?.data?.user;

  if (!user?.name || !user?.email) {
    Alert.alert("Error ❌", "Google User Info Missing!");
    return;
  }

  if (!phone || !ward || !address) {
    Alert.alert("Error ❌", "All fields are mandatory!");
    return;
  }

  try {
    const res = await fetch("https://rrr-backend-ftcw.onrender.com/api/users/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: user.name,
        email: user.email,
        phone: phone,
        ward_no: ward,
        address: address,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      Alert.alert("Failed ❌", data.error || "Registration Failed");
      return;
    }

    await AsyncStorage.setItem("user", JSON.stringify(data));

    Alert.alert("Registered ✅", "Welcome to RRR Center!");
    navigation.replace("Home");
  } catch (err: any) {
    console.log("REGISTER ERROR:", err);
    Alert.alert("Failed ❌", err.message);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Signup</Text>

      <TextInput
        placeholder="Phone Number"
        style={styles.input}
        keyboardType="phone-pad"
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        placeholder="Ward Number"
        style={styles.input}
        value={ward}
        onChangeText={setWard}
      />

      <TextInput
        placeholder="Full Address"
        style={styles.input}
        value={address}
        onChangeText={setAddress}
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Submit & Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f8f3",
    justifyContent: "center",
    padding: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: "900",
    marginBottom: 25,
    textAlign: "center",
    color: "#1b5e20",
  },

  input: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 14,
    marginBottom: 15,
    fontSize: 15,
  },

  button: {
    backgroundColor: "#1b5e20",
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "800",
  },
});


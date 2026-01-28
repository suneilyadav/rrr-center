import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { launchImageLibrary } from "react-native-image-picker";
import { logoutUser } from "../utils/auth";

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = useState<any>(null);
  const [avatar, setAvatar] = useState<string | null>(null);

  // ✅ Load User
  const loadUser = async () => {
    const saved = await AsyncStorage.getItem("user");
    if (saved) setUser(JSON.parse(saved));

    const savedAvatar = await AsyncStorage.getItem("avatar");
    if (savedAvatar) setAvatar(savedAvatar);
  };

  useEffect(() => {
    loadUser();
  }, []);

  // ✅ Pick Profile Photo
  const pickAvatar = async () => {
    const result: any = await launchImageLibrary({
      mediaType: "photo",
      quality: 0.7,
    });

    if (result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setAvatar(uri);

      await AsyncStorage.setItem("avatar", uri);
    }
  };

  // ✅ Logout
const handleLogout = async () => {
  await logoutUser(); // ✅ Central logout
  navigation.replace("Auth");
};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* ✅ Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      {/* ✅ Avatar Section */}
      <View style={styles.avatarBox}>
        <TouchableOpacity onPress={pickAvatar}>
          <Image
            source={
              avatar
                ? { uri: avatar }
                : require("../assets/avatar.png")
            }
            style={styles.avatar}
          />

          <View style={styles.cameraIcon}>
            <Ionicons name="camera" size={18} color="white" />
          </View>
        </TouchableOpacity>

        <Text style={styles.nameText}>
          {user?.name || "User"}
        </Text>
        <Text style={styles.emailText}>
          {user?.email}
        </Text>
      </View>

      {/* ✅ Info Card */}
      {user && (
        <View style={styles.infoCard}>
          <ProfileRow icon="call" label="Phone" value={user.phone} />
          <ProfileRow icon="location" label="Ward No" value={user.ward_no} />
          <ProfileRow icon="home" label="Address" value={user.address} />
        </View>
      )}

      {/* ✅ Buttons */}
      <View style={styles.buttonArea}>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Ionicons name="log-out" size={20} color="white" />
          <Text style={styles.btnText}> Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ✅ Small Component Row */
function ProfileRow({ icon, label, value }: any) {
  return (
    <View style={styles.row}>
      <Ionicons name={icon} size={20} color="green" />
      <View style={{ marginLeft: 12 }}>
        <Text style={styles.rowLabel}>{label}</Text>
        <Text style={styles.rowValue}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "green",
    padding: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
  },

  avatarBox: {
    alignItems: "center",
    marginTop: -40,
  },
  avatar: {
    width: 95,
    height: 95,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "white",
  },
  cameraIcon: {
    position: "absolute",
    bottom: 0,
    right: 5,
    backgroundColor: "green",
    borderRadius: 20,
    padding: 6,
  },

  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  emailText: {
    fontSize: 13,
    color: "gray",
    marginBottom: 20,
  },

  infoCard: {
    backgroundColor: "#f9f9f9",
    marginHorizontal: 20,
    padding: 18,
    borderRadius: 18,
    elevation: 2,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  rowLabel: {
    fontSize: 12,
    color: "gray",
  },
  rowValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    width: 250,
  },

  buttonArea: {
    marginTop: 25,
    paddingHorizontal: 20,
  },

  logoutBtn: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "red",
    padding: 14,
    borderRadius: 15,
  },

  btnText: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
  },
});


import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

// ✅ SafeArea fix
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { getUserEmail } from "../utils/auth"; // ✅ ADD THIS

export default function ClaimsScreen() {
  const [claimedItems, setClaimedItems] = useState([]);

const [userEmail, setUserEmail] = useState<string | null>(null);
// ✅ Load Logged-in Email
React.useEffect(() => {
  const loadEmail = async () => {
    const email = await getUserEmail();
    setUserEmail(email);
  };

  loadEmail();
}, []);
  // ✅ Fetch Claimed Items
const fetchClaims = async () => {
  if (!userEmail) return;

  const res = await axios.get("https://rrr-backend-ftcw.onrender.com/api/items");

  const filtered = res.data.filter(
    (it: any) => it.claimed_by_email === userEmail
  );

  setClaimedItems(filtered);
};

  // ✅ Auto Refresh when tab opens
useFocusEffect(
  React.useCallback(() => {
    if (!userEmail) return; // ✅ wait for email

    fetchClaims();

    const interval = setInterval(() => {
      fetchClaims();
    }, 5000);

    return () => clearInterval(interval);
  }, [userEmail]) // ✅ dependency added
);

  // ✅ Unclaim Item
  const unclaimItem = async (id: number) => {
if (!userEmail) {
    alert("User not logged in!");
    return;
  }
    await axios.post(`https://rrr-backend-ftcw.onrender.com/api/items/${id}/claim`, {
      claimed_by_email: userEmail,
    });

    fetchClaims();
  };

  // ✅ Mark Collected
  const markCollected = async (id: number) => {
    await axios.post(`https://rrr-backend-ftcw.onrender.com/api/items/${id}/collect`);
    fetchClaims();
  };

return (
  <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
    {/* ✅ Header */}
    <View style={styles.header}>
      <Text style={styles.headerTitle}>My Claimed Items</Text>
      <Text style={styles.quote}>
        ✨ Claim responsibly, help your community!
      </Text>
    </View>

    <ScrollView style={styles.container}>
      {claimedItems.length === 0 ? (
        <Text style={styles.emptyText}>
          No claimed items yet...
        </Text>
      ) : (
        claimedItems.map((it: any) => {
          const claimedTime = it.claimed_at
            ? new Date(it.claimed_at).toLocaleString()
            : "";

          return (
            <View key={it.id} style={styles.card}>
              {/* Item Title */}
              <Text style={styles.title}>{it.item_name}</Text>

              {/* Category */}
              <Text style={styles.meta}>
                📌 Category: {it.category}
              </Text>

              {/* Claimed Time */}
              <Text style={styles.timeText}>
                ⏰ Claimed: {claimedTime}
              </Text>

              {/* Status Badge */}
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: it.collected
                      ? "gray"
                      : "#f59e0b",
                  },
                ]}
              >
                <Text style={styles.badgeText}>
                  {it.collected ? "COLLECTED ✅" : "CLAIMED"}
                </Text>
              </View>

              {/* Unclaim Button */}
              {!it.collected && (
                <TouchableOpacity
                  style={styles.unclaimBtn}
                  onPress={() => unclaimItem(it.id)}
                >
                  <Ionicons
                    name="close-circle"
                    size={20}
                    color="white"
                  />
                  <Text style={styles.btnText}> Unclaim</Text>
                </TouchableOpacity>
              )}

              {/* Collected Button */}
              <TouchableOpacity
                disabled={it.collected === true}
                style={[
                  styles.collectBtn,
                  {
                    backgroundColor: it.collected
                      ? "gray"
                      : "#2563eb",
                  },
                ]}
                onPress={() => markCollected(it.id)}
              >
                <Ionicons
                  name="checkmark-done"
                  size={20}
                  color="white"
                />
                <Text style={styles.btnText}>
                  {it.collected
                    ? " Collected"
                    : " Mark Collected"}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })
      )}
    </ScrollView>
  </SafeAreaView>
);

}
const styles = StyleSheet.create({
  container: {
    padding: 18,
  },

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

  quote: {
    marginTop: 6,
    fontSize: 13,
    color: "#e6ffe6",
    fontStyle: "italic",
  },

  emptyText: {
    marginTop: 30,
    color: "gray",
    textAlign: "center",
    fontSize: 15,
  },

  card: {
    backgroundColor: "#f9f9f9",
    padding: 18,
    borderRadius: 18,
    marginBottom: 18,
    elevation: 3,
  },

  badge: {
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 15,
  },

  badgeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 13,
  },

  unclaimBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
    padding: 13,
    borderRadius: 14,
    marginBottom: 10,
  },

  collectBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 13,
    borderRadius: 14,
  },

  btnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
});


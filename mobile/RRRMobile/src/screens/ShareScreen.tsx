import React, { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import axios from "axios";
import { Picker } from "@react-native-picker/picker";
import { getUserEmail } from "../utils/auth";

export default function ShareScreen() {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("Furniture");
  const [condition, setCondition] = useState("Good");

  const [postType, setPostType] = useState("FREE");
  const [price, setPrice] = useState("");

  // ✅ Multiple Photos (Max 5)
  const [photos, setPhotos] = useState<any[]>([]);

  // ✅ My Posted Items
  const [myItems, setMyItems] = useState([]);
const [userEmail, setUserEmail] = useState<string | null>(null); // ✅ NEW

// ✅ LOAD EMAIL
React.useEffect(() => {
  const loadEmail = async () => {
    const email = await getUserEmail();
    setUserEmail(email);
  };

  loadEmail();
}, []);

  // ✅ Fetch My Items
const fetchMyItems = async () => {
  if (!userEmail) return;

  const res = await axios.get("https://rrr-backend-ftcw.onrender.com/api/items");

  const filtered = res.data.filter(
    (it: any) => it.posted_by_email === userEmail
  );

  setMyItems(filtered);
};

  // ✅ Auto Refresh when tab opens
useFocusEffect(
  React.useCallback(() => {
    if (!userEmail) return; // ✅ wait for email

    fetchMyItems();

    const interval = setInterval(() => {
      fetchMyItems();
    }, 5000);

    return () => clearInterval(interval);
  }, [userEmail]) // ✅ dependency added
);

  // ✅ Gallery Picker (Max 5)
  const pickFromGallery = async () => {
    if (photos.length >= 5) {
      alert("❌ Maximum 5 images allowed!");
      return;
    }

    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 0.7,
    });

    if (result.assets?.length > 0) {
      setPhotos([...photos, result.assets[0]]);
    }
  };

  // ✅ Camera Picker (Max 5)
  const takePhoto = async () => {
    if (photos.length >= 5) {
      alert("❌ Maximum 5 images allowed!");
      return;
    }

    const result = await launchCamera({
      mediaType: "photo",
      quality: 0.7,
    });

    if (result.assets?.length > 0) {
      setPhotos([...photos, result.assets[0]]);
    }
  };

  // ✅ Post Item
  const postItem = async () => {
if (!userEmail) {
    alert("User not logged in!");
    return;
  }
    await axios.post("https://rrr-backend-ftcw.onrender.com/api/items", {
      item_name: itemName,
      category,
      quantity: 1,
      condition,
      posted_by_email: userEmail,

      // ✅ Send Multiple Images
      image_urls: photos.map((p) => p.uri),

      post_type: postType,
      price: postType === "PAID" ? price : null,
    });

    alert("✅ Item Posted!");

    setItemName("");
    setPhotos([]);
    setPostType("FREE");
    setPrice("");

    fetchMyItems();
  };

  // ✅ Mark Collected
  const markCollected = async (id: number) => {
    await axios.post(`https://rrr-backend-ftcw.onrender.com/api/items/${id}/collect`);
    fetchMyItems();
  };

  // ✅ Delete Item
  const deleteItem = async (id: number) => {
    await axios.delete(`https://rrr-backend-ftcw.onrender.com/api/items/${id}`);
    fetchMyItems();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView style={{ flex: 1 }}>
        {/* ✅ HEADER */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Share Item</Text>
          <Text style={styles.quote}>
            🌱 Share what you don’t need, someone else may smile today!
          </Text>
        </View>

        {/* ✅ MAIN CONTENT */}
        <View style={styles.container}>
          {/* Item Name */}
          <TextInput
            placeholder="Enter Item Name"
            value={itemName}
            onChangeText={setItemName}
            style={styles.input}
          />

          {/* Category */}
          <Text style={styles.label}>Category</Text>
          <View style={styles.dropdownBox}>
            <Picker selectedValue={category} onValueChange={setCategory}>
              <Picker.Item label="🪑 Furniture" value="Furniture" />
              <Picker.Item label="📱 Electronics" value="Electronics" />
              <Picker.Item label="👕 Clothes" value="Clothes" />
              <Picker.Item label="👟 Shoes" value="Shoes" />
              <Picker.Item label="🧱 Scrap" value="Scrap" />
              <Picker.Item label="🔩 Metal" value="Metal" />
              <Picker.Item label="🧴 Plastic" value="Plastic" />
              <Picker.Item label="📄 Paper" value="Paper" />
              <Picker.Item label="🧸 Toys & Books" value="ToysBooks" />
              <Picker.Item label="📦 Others" value="Others" />
            </Picker>
          </View>

          {/* Condition */}
          <Text style={styles.label}>Condition</Text>
          <View style={styles.dropdownBox}>
            <Picker selectedValue={condition} onValueChange={setCondition}>
              <Picker.Item label="✨ Like New" value="Like New" />
              <Picker.Item label="👍 Good" value="Good" />
              <Picker.Item label="⚙️ Working" value="Working" />
              <Picker.Item label="🛠 Repair Needed" value="Repair Needed" />
            </Picker>
          </View>

          {/* Post Type */}
          <Text style={styles.label}>Post Type</Text>
          <View style={styles.dropdownBox}>
            <Picker selectedValue={postType} onValueChange={setPostType}>
              <Picker.Item label="♻️ Free" value="FREE" />
              <Picker.Item label="💰 Paid" value="PAID" />
            </Picker>
          </View>

          {/* Price */}
          {postType === "PAID" && (
            <TextInput
              placeholder="Enter Price ₹"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
              style={styles.input}
            />
          )}

          {/* Photo Buttons */}
          <View style={styles.photoRow}>
            <TouchableOpacity style={styles.blueBtn} onPress={takePhoto}>
              <Text style={styles.btnText}>📷 Camera</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.blueBtn} onPress={pickFromGallery}>
              <Text style={styles.btnText}>🖼 Gallery</Text>
            </TouchableOpacity>
          </View>

          {/* ✅ Preview Multiple Images */}
          <View style={styles.previewRow}>
            {photos.map((p, index) => (
              <Image
                key={index}
                source={{ uri: p.uri }}
                style={styles.previewSmall}
              />
            ))}
          </View>

          <Text style={styles.counterText}>
            {photos.length}/5 Images Selected
          </Text>

          {/* Post Button */}
          <TouchableOpacity style={styles.greenBtn} onPress={postItem}>
            <Text style={styles.btnText}>✅ Post Item</Text>
          </TouchableOpacity>

          {/* My Shared Items */}
          <Text style={styles.subHeading}>My Shared Items</Text>

          {myItems.map((it: any) => (
            <View key={it.id} style={styles.myCard}>
              <Text style={styles.itemTitle}>{it.item_name}</Text>

              {/* ✅ Price Badge */}
              {it.post_type === "PAID" && (
                <Text style={styles.priceBadge}>₹ {it.price}</Text>
              )}

              {/* Status Badge */}
              <Text
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      it.status === "AVAILABLE"
                        ? "green"
                        : it.status === "CLAIMED"
                        ? "orange"
                        : "gray",
                  },
                ]}
              >
                {it.status}
              </Text>

              {/* Collected Button */}
              <TouchableOpacity
                disabled={it.collected === true}
                style={[
                  styles.collectBtn,
                  {
                    backgroundColor: it.collected ? "gray" : "#007bff",
                  },
                ]}
                onPress={() => markCollected(it.id)}
              >
                <Text style={styles.btnText}>
                  {it.collected ? "Collected ✅" : "Mark Collected"}
                </Text>
              </TouchableOpacity>

              {/* Delete Button */}
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => deleteItem(it.id)}
              >
                <Text style={styles.btnText}>🗑 Delete Item</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* ✅ STYLES */
const styles = StyleSheet.create({
  container: {
    padding: 18,
  },

  header: {
    backgroundColor: "green",
    padding: 22,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 15,
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

  subHeading: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 25,
    marginBottom: 10,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 10,
    marginBottom: 5,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  dropdownBox: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    marginBottom: 10,
    overflow: "hidden",
  },

  photoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 12,
  },

  blueBtn: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 10,
    width: "48%",
    alignItems: "center",
  },

  greenBtn: {
    backgroundColor: "green",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },

  btnText: {
    color: "white",
    fontWeight: "bold",
  },

  previewRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },

  previewSmall: {
    width: 70,
    height: 70,
    borderRadius: 10,
    margin: 5,
  },

  counterText: {
    textAlign: "center",
    marginTop: 6,
    color: "gray",
  },

  myCard: {
    backgroundColor: "#f9f9f9",
    padding: 14,
    borderRadius: 14,
    marginBottom: 14,
  },

  itemTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 6,
  },

  priceBadge: {
    backgroundColor: "#facc15",
    color: "black",
    fontWeight: "bold",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 8,
  },

  statusBadge: {
    color: "white",
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: "flex-start",
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 10,
  },

  collectBtn: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  deleteBtn: {
    backgroundColor: "red",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
});


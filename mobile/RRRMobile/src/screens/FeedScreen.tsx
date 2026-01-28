import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  TextInput,
  Button,
  Share,
  Linking,
} from "react-native";

import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserEmail } from "../utils/auth";

export default function FeedScreen() {
  const [items, setItems] = useState([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
// ❤️ Likes + 💬 Comments States
const [likesCount, setLikesCount] = useState<{ [key: number]: number }>({});
// ❤️ Track if current user liked item
const [likedItems, setLikedItems] = useState<{ [key: number]: boolean }>({});
const [showComments, setShowComments] = useState(false);
const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
const [comments, setComments] = useState<any[]>([]);
const [commentsCount, setCommentsCount] = useState<{ [key: number]: number }>({});
const [newComment, setNewComment] = useState("");
const [contactPhones, setContactPhones] = useState<{ [key: number]: string }>({});

  // ✅ Quotes (future में बदल सकते हैं)
  const quotes = [
    "🌍 Sharing makes the world greener!",
    "✨ Someone’s trash is someone’s treasure!",
    "💚 Give what you don’t need, receive blessings!",
    "♻️ Small acts create big change!",
  ];

  const randomQuote =
    quotes[Math.floor(Math.random() * quotes.length)];

// ✅ LOAD USER EMAIL
React.useEffect(() => {
  const loadEmail = async () => {
    const email = await getUserEmail();
    setUserEmail(email);
  };

  loadEmail();
}, []);
  
// ✅ Fetch items
  const fetchItems = async () => {
    try {
      const res = await axios.get("https://rrr-backend-ftcw.onrender.com/api/items");
setItems(res.data);
// ✅ Load comment counts also
res.data.forEach((item: any) => openCommentsCount(item.id));

// ❤️ Load likes for each item
res.data.forEach((item: any) => fetchLikes(item.id));
    } catch (err) {
      console.log("Error fetching items:", err);
    }
  };

  // ✅ Auto Refresh when screen opens
  useFocusEffect(
    React.useCallback(() => {
      fetchItems();
    }, [])
  );

// ============================
// ❤️ FETCH LIKE COUNT
// ============================
const fetchLikes = async (itemId: number) => {
  try {
    const res = await axios.get(
      `https://rrr-backend-ftcw.onrender.com/api/items/${itemId}/likes`
    );

    setLikesCount((prev) => ({
      ...prev,
      [itemId]: parseInt(res.data.likes),
    }));
  } catch (err) {
    console.log("Like count error:", err);
  }
};

// ============================
// ❤️ LIKE TOGGLE
// ============================
const handleLike = async (itemId: number) => {
  if (!userEmail) return;

  try {
    // ✅ API Call
    await axios.post(
      `https://rrr-backend-ftcw.onrender.com/api/items/${itemId}/like`,
      { user_email: userEmail }
    );

    // ✅ Highlight Toggle (Red/Gray Heart)
    setLikedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));

    // ✅ Refresh Like Count
    fetchLikes(itemId);

  } catch (err) {
    console.log("Like toggle error:", err);
  }
};

// ============================
// 🔁 SHARE ITEM FUNCTION
// ============================
const handleShare = async (item: any) => {
  try {
    await Share.share({
      message: `♻️ RRR Center Item:\n\n📌 ${item.item_name}\nCategory: ${item.category}\nType: ${item.post_type}\n\nDownload RRR Center App to claim it!`,
    });
  } catch (error) {
    console.log("Share error:", error);
  }
};

// ============================
// 📞 CONTACT DETAILS FETCH (Dynamic)
// ============================
const handleContact = async (itemId: number) => {
  try {
    const res = await axios.get(
      `https://rrr-backend-ftcw.onrender.com/api/items/${itemId}/contact`
    );

    const data = res.data;

    let phoneToContact = null;

    // If current user is claimer → contact owner
    if (data.claimer_email === userEmail) {
      phoneToContact = data.owner_phone;
    }

    // If current user is owner → contact claimer
    else if (data.owner_email === userEmail) {
      phoneToContact = data.claimer_phone;
    }

if (!phoneToContact) {
  alert("Contact not available yet!");
  return;
}

// ✅ Save phone in state so UI can show
setContactPhones((prev) => ({
  ...prev,
  [itemId]: phoneToContact,
}));

// ✅ Open WhatsApp
Linking.openURL(
  `https://wa.me/91${phoneToContact}?text=Hi, I am contacting you from RRR Center app regarding the claimed item.`
);
  } catch (err) {
    console.log("Contact error:", err);
  }
};

// ============================
// 💬 COMMENT COUNT FETCH
// ============================
const openCommentsCount = async (itemId: number) => {
  try {
    const res = await axios.get(
      `https://rrr-backend-ftcw.onrender.com/api/items/${itemId}/comments`
    );

    setCommentsCount((prev) => ({
      ...prev,
      [itemId]: res.data.length,
    }));
  } catch (err) {
    console.log("Comment count error:", err);
  }
};

// ============================
// 💬 OPEN COMMENTS
// ============================
const openComments = async (itemId: number) => {
  setSelectedItemId(itemId);
  setShowComments(true);

  try {
    const res = await axios.get(
      `https://rrr-backend-ftcw.onrender.com/api/items/${itemId}/comments`
    );
setComments(res.data);

// ✅ Store comment count
setCommentsCount((prev) => ({
  ...prev,
  [itemId]: res.data.length,
}));
  } catch (err) {
    console.log("Fetch comments error:", err);
  }
};

// ============================
// 💬 ADD COMMENT
// ============================
const addComment = async () => {
  if (!newComment.trim() || !selectedItemId || !userEmail) return;

  try {
    await axios.post(
      `https://rrr-backend-ftcw.onrender.com/api/items/${selectedItemId}/comments`,
      {
        user_email: userEmail,
        comment: newComment,
      }
    );

    setNewComment("");
    openComments(selectedItemId); // refresh comments
    openCommentsCount(selectedItemId);
  } catch (err) {
    console.log("Add comment error:", err);
  }
};

  // ✅ Claim Toggle (Same as before)
const handleClaimToggle = async (id: number) => {
  // ✅ Safety Check
  if (!userEmail) {
    alert("User not logged in yet!");
    return;
  }

  await axios.post(`https://rrr-backend-ftcw.onrender.com/api/items/${id}/claim`, {
    claimed_by_email: userEmail,
  });

// ✅ Clear phone if item becomes unclaimed
  setContactPhones((prev) => {
    const updated = { ...prev };
    delete updated[id];
    return updated;
  });

  fetchItems();
};

  // ✅ Render Card
  const renderItem = ({ item }: any) => {
    // Posted Time Format
    const postedTime = new Date(item.created_at).toLocaleString();

    return (
      <View style={styles.card}>
        {/* Header */}
        <Text style={styles.userText}>👤 {item.posted_by_email}</Text>
        <Text style={styles.timeText}>Posted: {postedTime}</Text>

        {/* ✅ Multiple Images Carousel */}
        {item.image_urls && item.image_urls.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {item.image_urls.map((img: string, index: number) => (
              <Image
                key={index}
                source={{ uri: img }}
                style={styles.multiImage}
              />
            ))}
          </ScrollView>
        ) : item.image_url ? (
          <Image
            source={{ uri: item.image_url }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text>No Photo</Text>
          </View>
        )}

        {/* Item Name */}
        <Text style={styles.title}>{item.item_name}</Text>

        {/* Category */}
        <Text style={styles.metaText}>📌 Category: {item.category}</Text>

        {/* Free / Paid */}
        <Text style={styles.metaText}>
          Type:{" "}
          {item.post_type === "PAID" ? (
            <Text style={styles.priceBadge}>₹ {item.price}</Text>
          ) : (
            "Free"
          )}
        </Text>

        {/* Status */}
        <Text
          style={
            item.status === "AVAILABLE"
              ? styles.available
              : styles.claimed
          }
        >
          {item.status}
        </Text>

        {/* Claimed By */}
        {item.status === "CLAIMED" && (
          <Text style={styles.claimedBy}>
            Claimed By: {item.claimed_by_email}
          </Text>
        )}

        {/* Actions */}
<View style={styles.actions}>
  {/* ❤️ Like Button */}
  <TouchableOpacity onPress={() => handleLike(item.id)}>
<Text
  style={[
    styles.actionBtn,
    likedItems[item.id] && { color: "red" },
  ]}
>
  {likedItems[item.id] ? "❤️" : "🤍"} {likesCount[item.id] || 0}
</Text>
  </TouchableOpacity>

  {/* 💬 Comment Button */}
<TouchableOpacity onPress={() => openComments(item.id)}>
  <Text style={styles.actionBtn}>
    💬 Comments ({commentsCount[item.id] || 0})
  </Text>
</TouchableOpacity>

{/* 🔁 Share Button */}
<TouchableOpacity onPress={() => handleShare(item)}>
  <Text style={styles.actionBtn}>🔁 Share</Text>
</TouchableOpacity>

</View>

{/* ✅ Claim / Unclaim Logic */}

{/* AVAILABLE → Everyone can Claim */}
{item.status === "AVAILABLE" && (
  <TouchableOpacity
    style={[styles.claimBtn, { backgroundColor: "green" }]}
    onPress={() => handleClaimToggle(item.id)}
  >
    <Text style={styles.claimBtnText}>Claim Item</Text>
  </TouchableOpacity>
)}

{/* CLAIMED → Only Claimed User can Unclaim */}
{item.status === "CLAIMED" &&
  item.claimed_by_email === userEmail && (
    <TouchableOpacity
      style={[styles.claimBtn, { backgroundColor: "gray" }]}
      onPress={() => handleClaimToggle(item.id)}
    >
      <Text style={styles.claimBtnText}>Unclaim</Text>
    </TouchableOpacity>
)}

{/* CLAIMED → Other Users only see message */}
      {item.status === "CLAIMED" && item.claimed_by_email !== userEmail && (
        <View style={[styles.claimBtn, { backgroundColor: "#ccc" }]}>
          <Text style={{ fontWeight: "bold", color: "red" }}>
            Already Claimed
          </Text>
        </View>
      )}
{/* 📞 Show Phone Number */}
{item.status === "CLAIMED" && contactPhones[item.id] && (
  <Text style={{ marginTop: 6, fontSize: 14 }}>
    📞 Phone: {contactPhones[item.id]}
  </Text>
)}

{/* 📞 WhatsApp Contact Button */}
{item.status === "CLAIMED" &&
  (item.claimed_by_email === userEmail ||
    item.posted_by_email === userEmail) && (
      <TouchableOpacity
        style={{
          marginTop: 10,
          padding: 12,
          backgroundColor: "#16a34a",
          borderRadius: 12,
          alignItems: "center",
        }}
        onPress={() => handleContact(item.id)}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          {item.claimed_by_email === userEmail
            ? "💬 Contact Owner on WhatsApp"
            : "💬 Contact Claimer on WhatsApp"}
        </Text>
      </TouchableOpacity>
)}
    </View>
  );
};
return (
  <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
    
    {/* ✅ Header Quote */}
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Community Feed</Text>
      <Text style={styles.quote}>{randomQuote}</Text>
    </View>

    {/* Feed List */}
    <FlatList
      data={items}
      keyExtractor={(item: any) => item.id.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom: 40 }}
    />

{/* 💬 Comments Modal */}
<Modal visible={showComments} animationType="slide">
  <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
    
    {/* Header */}
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
        borderBottomWidth: 1,
        borderColor: "#eee",
      }}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        💬 Comments
      </Text>

      <TouchableOpacity onPress={() => setShowComments(false)}>
        <Text style={{ fontSize: 18, color: "red" }}>✖</Text>
      </TouchableOpacity>
    </View>

    {/* Comment List */}
    <FlatList
      data={comments}
      keyExtractor={(c) => c.id.toString()}
      contentContainerStyle={{ padding: 15 }}
      renderItem={({ item }) => (
        <View
          style={{
            backgroundColor: "#f9fafb",
            padding: 12,
            borderRadius: 12,
            marginBottom: 10,
          }}
        >
          <Text style={{ fontWeight: "bold" }}>
            👤 {item.user_email}
          </Text>

          <Text style={{ marginTop: 4 }}>{item.comment}</Text>

          <Text style={{ fontSize: 12, color: "gray", marginTop: 4 }}>
            🕒 {new Date(item.created_at).toLocaleString()}
          </Text>
        </View>
      )}
    />

    {/* Input Box */}
    <View
      style={{
        flexDirection: "row",
        padding: 12,
        borderTopWidth: 1,
        borderColor: "#eee",
      }}
    >
      <TextInput
        placeholder="Write a comment..."
        value={newComment}
        onChangeText={setNewComment}
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: "#ddd",
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 8,
        }}
      />

      <TouchableOpacity
        onPress={addComment}
        style={{
          marginLeft: 10,
          backgroundColor: "#2563eb",
          paddingHorizontal: 15,
          justifyContent: "center",
          borderRadius: 12,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>
          Send
        </Text>
      </TouchableOpacity>
    </View>

  </SafeAreaView>
</Modal>

  </SafeAreaView>
);
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#2563eb",
    padding: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    marginBottom: 10,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "white",
  },

  quote: {
    marginTop: 6,
    fontSize: 13,
    color: "#dbeafe",
    fontStyle: "italic",
  },

  card: {
    backgroundColor: "white",
    margin: 12,
    borderRadius: 18,
    padding: 14,
    elevation: 3,
  },

  userText: {
    fontSize: 15,
    fontWeight: "700",
    color: "green",
  },

  timeText: {
    fontSize: 12,
    color: "gray",
    marginBottom: 8,
  },

  image: {
    width: "100%",
    height: 220,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
  },

  multiImage: {
    width: 200,
    height: 180,
    borderRadius: 12,
    marginRight: 10,
    marginBottom: 10,
  },

  imagePlaceholder: {
    height: 220,
    borderRadius: 12,
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },

  metaText: {
    fontSize: 14,
    color: "#444",
    marginTop: 3,
  },

  priceBadge: {
    backgroundColor: "#facc15",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    fontWeight: "bold",
    color: "black",
  },

  available: {
    marginTop: 6,
    color: "green",
    fontWeight: "bold",
    fontSize: 16,
  },

  claimed: {
    marginTop: 6,
    color: "red",
    fontWeight: "bold",
    fontSize: 16,
  },

  claimedBy: {
    fontSize: 13,
    color: "#444",
    marginTop: 4,
    fontStyle: "italic",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 12,
  },

  actionBtn: {
    fontSize: 15,
    fontWeight: "600",
  },

  claimBtn: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  claimBtnText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});


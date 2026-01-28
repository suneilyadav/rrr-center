const express = require("express");
const router = express.Router();
const pool = require("../db");

// ✅ GET ALL ITEMS
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM items ORDER BY created_at DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ POST NEW ITEM
router.post("/", async (req, res) => {
  try {
    const {
      item_name,
      category,
      quantity,
      condition,
      posted_by_email,
      image_urls,
      post_type,
      price,
    } = req.body;

const result = await pool.query(
  `INSERT INTO items
   (item_name, category, quantity, condition, posted_by_email,
    image_urls, post_type, price, status, collected)

   VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'AVAILABLE',FALSE)

   RETURNING *`,
  [
    item_name,
    category,
    quantity,
    condition,
    posted_by_email,
    image_urls,
    post_type,
    price,
  ]
);

    res.json({
      message: "✅ Item posted successfully",
      item: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ============================
// ❤️ LIKE / UNLIKE ITEM
// ============================
router.post("/:id/like", async (req, res) => {
  try {
    const itemId = req.params.id;
    const { user_email } = req.body;

    if (!user_email) {
      return res.status(400).json({ error: "User email required" });
    }

    // Check if already liked
    const existing = await pool.query(
      "SELECT * FROM likes WHERE item_id=$1 AND user_email=$2",
      [itemId, user_email]
    );

    // If liked → Unlike
    if (existing.rows.length > 0) {
      await pool.query(
        "DELETE FROM likes WHERE item_id=$1 AND user_email=$2",
        [itemId, user_email]
      );

      return res.json({ message: "Unliked successfully" });
    }

    // Else → Like
    await pool.query(
      "INSERT INTO likes (item_id, user_email) VALUES ($1, $2)",
      [itemId, user_email]
    );

    res.json({ message: "Liked successfully" });
  } catch (err) {
    console.error("Like error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ============================
// 💬 ADD COMMENT
// ============================
router.post("/:id/comments", async (req, res) => {
  try {
    const itemId = req.params.id;
    const { user_email, comment } = req.body;

    if (!user_email || !comment) {
      return res.status(400).json({ error: "Email and comment required" });
    }

    const result = await pool.query(
      "INSERT INTO comments (item_id, user_email, comment) VALUES ($1, $2, $3) RETURNING *",
      [itemId, user_email, comment]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Comment error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ============================
// 📞 GET CONTACT DETAILS FOR ITEM
// ============================
router.get("/:id/contact", async (req, res) => {
  try {
    const itemId = req.params.id;

    // 1️⃣ Get item info
    const itemResult = await pool.query(
      "SELECT * FROM items WHERE id=$1",
      [itemId]
    );

    if (itemResult.rows.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    const item = itemResult.rows[0];

    // 2️⃣ Get owner phone
    const ownerResult = await pool.query(
      "SELECT phone FROM users WHERE email=$1",
      [item.posted_by_email]
    );

    // 3️⃣ Get claimer phone (if claimed)
    let claimerPhone = null;

    if (item.claimed_by_email) {
      const claimerResult = await pool.query(
        "SELECT phone FROM users WHERE email=$1",
        [item.claimed_by_email]
      );

      if (claimerResult.rows.length > 0) {
        claimerPhone = claimerResult.rows[0].phone;
      }
    }

    res.json({
      owner_email: item.posted_by_email,
      owner_phone: ownerResult.rows[0]?.phone || null,
      claimer_email: item.claimed_by_email,
      claimer_phone: claimerPhone,
    });
  } catch (err) {
    console.error("Contact fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ============================
// 📥 GET COMMENTS FOR ITEM
// ============================
router.get("/:id/comments", async (req, res) => {
  try {
    const itemId = req.params.id;

    const result = await pool.query(
      "SELECT * FROM comments WHERE item_id=$1 ORDER BY created_at DESC",
      [itemId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Fetch comments error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ============================
// ❤️ GET LIKE COUNT
// ============================
router.get("/:id/likes", async (req, res) => {
  try {
    const itemId = req.params.id;

    const result = await pool.query(
      "SELECT COUNT(*) FROM likes WHERE item_id=$1",
      [itemId]
    );

    res.json({ likes: result.rows[0].count });
  } catch (err) {
    console.error("Like count error:", err);
    res.status(500).json({ error: "Server error" });
  }
});


// ✅ CLAIM / UNCLAIM TOGGLE (FIXED FULL)
router.post("/:id/claim", async (req, res) => {
  try {
    const { claimed_by_email } = req.body;

    // ✅ पहले item निकालो
    const itemCheck = await pool.query(
      "SELECT * FROM items WHERE id=$1",
      [req.params.id]
    );

    const item = itemCheck.rows[0];

    // ❌ अगर item नहीं मिला
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    // ✅ अगर AVAILABLE है → CLAIM करो + Reset collected
    if (item.status === "AVAILABLE") {
      const result = await pool.query(
        `UPDATE items
         SET status='CLAIMED',
             claimed_by_email=$1,
             claimed_at=NOW(),

             -- ✅ Reset collected when re-claimed
             collected=FALSE,
             collected_at=NULL

         WHERE id=$2
         RETURNING *`,
        [claimed_by_email, req.params.id]
      );

      return res.json({
        message: "✅ Item claimed",
        item: result.rows[0],
      });
    }

    // ✅ अगर वही user unclaim कर रहा है → वापस AVAILABLE + Reset collected
    if (
      item.status === "CLAIMED" &&
      item.claimed_by_email === claimed_by_email
    ) {
      const result = await pool.query(
        `UPDATE items
         SET status='AVAILABLE',
             claimed_by_email=NULL,
             claimed_at=NULL,

             -- ✅ Reset collected also
             collected=FALSE,
             collected_at=NULL

         WHERE id=$1
         RETURNING *`,
        [req.params.id]
      );

      return res.json({
        message: "✅ Item unclaimed",
        item: result.rows[0],
      });
    }

    // ❌ किसी और ने claim किया है
    return res.status(400).json({
      message: "❌ Already claimed by another user",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ COLLECT ITEM
router.post("/:id/collect", async (req, res) => {
  try {
    const result = await pool.query(
      `UPDATE items
       SET collected=TRUE,
           collected_at=NOW()
       WHERE id=$1
       RETURNING *`,
      [req.params.id]
    );

    res.json({
      message: "✅ Item marked collected",
      item: result.rows[0],
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ DELETE ITEM
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM items WHERE id=$1", [req.params.id]);

    res.json({ message: "✅ Item deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;


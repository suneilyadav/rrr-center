const express = require("express");
const router = express.Router();

// DB Pool Import
const pool = require("../db");

// ✅ Register User (Google Login के बाद)
router.post("/register", async (req, res) => {
  try {
    // ✅ Google से name भी आएगा
    const { name, email, phone, ward, address } = req.body;

    // ✅ Mandatory Fields Check
    if (!email || !phone || !ward || !address) {
      return res.status(400).json({
        error: "All fields required: email, phone, ward, address",
      });
    }

    // ✅ Check if user already exists
    const existing = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

    // ✅ If already exists → Update missing details
    if (existing.rows.length > 0) {
      const updated = await pool.query(
        `UPDATE users
         SET name=$1, phone=$2, ward=$3, address=$4
         WHERE email=$5
         RETURNING *`,
        [name || existing.rows[0].name, phone, ward, address, email]
      );

      return res.json(updated.rows[0]);
    }

    // ✅ Insert new user
    const result = await pool.query(
      `INSERT INTO users (name, email, phone, ward, address)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [name || "", email, phone, ward, address]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Admin: Get All Registered Users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM users ORDER BY created_at DESC"
    );

    res.json(result.rows);
  } catch (err) {
    console.error("Fetch Users Error:", err);
    res.status(500).send("Server Error");
  }
});

// ✅ Admin: Disable / Enable User
router.patch("/:id/disable", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "UPDATE users SET is_disabled = NOT is_disabled WHERE id=$1 RETURNING *",
      [id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Disable User Error:", err);
    res.status(500).send("Server Error");
  }
});

// ✅ Admin: Delete User
router.delete("/:id", async (req, res) => {
  try {
    console.log("🔥 DELETE USER HIT:", req.params.id);

    const { id } = req.params;

    await pool.query("DELETE FROM users WHERE id=$1", [id]);

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete User Error:", err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;


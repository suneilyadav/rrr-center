const express = require("express");
const router = express.Router();

// DB Pool Import
const pool = require("../db");

// ✅ Register User (Google Login के बाद)
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, ward_no, address } = req.body;

    // ✅ Mandatory Fields Check
    if (!name || !email || !phone || !ward_no || !address) {
      return res.status(400).json({
        error:
          "All fields required: name, email, phone, ward_no, address",
      });
    }

    // ✅ Check if user already exists
    const existing = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email]
    );

if (existing.rows.length > 0) {
  // ✅ Update missing details
  const updated = await pool.query(
    `UPDATE users
     SET phone=$1, ward_no=$2, address=$3
     WHERE email=$4
     RETURNING *`,
    [phone, ward_no, address, email]
  );

  return res.json(updated.rows[0]);
}

    // ✅ Insert new user
    const result = await pool.query(
      `INSERT INTO users (name, email, phone, ward_no, address)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING *`,
      [name, email, phone, ward_no, address]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).send("Server Error");
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


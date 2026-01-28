const express = require("express");
const router = express.Router();

// Hardcoded Admin Login
router.post("/login", (req, res) => {
  const { adminId, password } = req.body;

  if (adminId === "admin" && password === "admin@123") {
    return res.json({
      status: "success",
      message: "Admin login successful",
      admin: { id: "admin", role: "admin" },
    });
  }

  res.status(401).json({
    status: "error",
    message: "Invalid credentials",
  });
});

module.exports = router;


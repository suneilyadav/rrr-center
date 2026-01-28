require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  res.json({ status: "RRR Center API running" });
});

// ======================================================
// ✅ ROUTES IMPORT
// ======================================================
const adminRoutes = require("./routes/adminRoutes");
const itemsRoutes = require("./routes/itemsRoutes");
const userRoutes = require("./routes/userRoutes");

// ======================================================
// ✅ ROUTES USE
// ======================================================
app.use("/api/admin", adminRoutes);
app.use("/api/items", itemsRoutes);
app.use("/api/users", userRoutes);

// ======================================================
// ✅ DEBUG: PRINT ROUTES LOADED
// ======================================================
console.log("✅ API Routes Loaded:");
console.log("➡ /api/admin");
console.log("➡ /api/items");
console.log("➡ /api/users");

// ======================================================
module.exports = app;


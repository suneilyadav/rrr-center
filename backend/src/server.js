require("dotenv").config();

const app = require("./app");

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port:", PORT);
  console.log("✅ DB USER =", process.env.DB_USER);
});


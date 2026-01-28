exports.adminLogin = (req, res) => {
  const { adminId, password } = req.body;

  // HARD-CODED ADMIN CREDENTIALS
  const ADMIN_ID = "admin";
  const ADMIN_PASSWORD = "admin@123";

  if (!adminId || !password) {
    return res.status(400).json({
      message: "adminId and password required",
    });
  }

  if (adminId !== ADMIN_ID || password !== ADMIN_PASSWORD) {
    return res.status(401).json({
      message: "Invalid admin credentials",
    });
  }

  return res.json({
    status: "success",
    message: "Admin login successful",
    admin: {
      id: "admin",
      role: "admin",
    },
  });
};


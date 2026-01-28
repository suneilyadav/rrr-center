import { useState } from "react";

function Login({ onSuccess }) {
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // LOGIN HANDLER
  const handleLogin = async () => {
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          adminId: adminId,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      // SUCCESS → Open Dashboard
      onSuccess();
    } catch (err) {
      setError("Backend server not reachable");
    }
  };

  return (
    <div
      style={{
        height: "100vh",
        background: "linear-gradient(to right, #e3f2fd, #ffffff)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial",
      }}
    >
      <div
        style={{
          width: "420px",
          background: "white",
          padding: "35px",
          borderRadius: "12px",
          boxShadow: "0px 4px 15px rgba(0,0,0,0.15)",
        }}
      >
        <h1 style={{ margin: 0, color: "#0d47a1" }}>
          RRR Center Portal
        </h1>

        <h3 style={{ marginTop: "5px", color: "#444" }}>
          Narmadapuram Municipal Council
        </h3>

        <p style={{ fontSize: "14px", color: "#666" }}>
          ♻️ Reduce • Reuse • Recycle Center Administration Panel <br />
          नगर पालिका परिषद नर्मदापुरम – RRR केंद्र प्रबंधन प्रणाली
        </p>

        <hr style={{ margin: "20px 0" }} />

        {/* Admin ID */}
        <div style={{ marginTop: "15px" }}>
          <label style={{ fontWeight: "bold" }}>Admin ID</label>
          <input
            type="text"
            value={adminId}
            onChange={(e) => setAdminId(e.target.value)}
            placeholder="Enter Admin ID"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Password */}
        <div style={{ marginTop: "15px" }}>
          <label style={{ fontWeight: "bold" }}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "6px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {/* Error */}
        {error && (
          <p style={{ color: "red", marginTop: "15px" }}>{error}</p>
        )}

        {/* Button */}
        <button
          onClick={handleLogin}
          style={{
            marginTop: "25px",
            width: "100%",
            padding: "12px",
            background: "#0d47a1",
            color: "white",
            fontSize: "16px",
            fontWeight: "bold",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          Login to Dashboard
        </button>

        <p
          style={{
            marginTop: "20px",
            fontSize: "12px",
            color: "#777",
            textAlign: "center",
          }}
        >
          Authorized Municipal Staff Only <br />
          केवल अधिकृत नगर पालिका कर्मचारियों हेतु
        </p>
      </div>
    </div>
  );
}

export default Login;


import { useEffect, useState } from "react";

function Dashboard({ onLogout }) {
  // ✅ Items Records
  const [records, setRecords] = useState([]);

  // ✅ Registered Users Records
  const [users, setUsers] = useState([]);

  // ✅ Calendar Date Filter (Items)
  const [selectedDate, setSelectedDate] = useState("");

  // ✅ Ward Search Filter (Users)
  const [wardSearch, setWardSearch] = useState("");

  // ======================================================
  // ✅ FETCH ITEMS FROM BACKEND
  // ======================================================
  const fetchRecords = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/items");
      const data = await res.json();

      const formatted = data.map((item) => ({
        id: item.id,
        itemName: item.item_name,
        category: item.category,
        quantity: item.quantity,
        condition: item.condition,

        postedBy: item.posted_by_email,
        postedAt: item.created_at ? item.created_at.split("T")[0] : "-",

        status: item.status,

        claimedBy: item.claimed_by_email || "-",
        claimedAt: item.claimed_at ? item.claimed_at.split("T")[0] : "-",

        collected: item.collected ? "YES" : "NO",
      }));

      setRecords(formatted);
    } catch (err) {
      console.log("❌ Error fetching items:", err);
    }
  };

  // ======================================================
  // ✅ FETCH REGISTERED USERS FROM BACKEND
  // ======================================================
  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.log("❌ Error fetching users:", err);
    }
  };

  // Load on page start
  useEffect(() => {
    fetchRecords();
    fetchUsers();
  }, []);

  // ======================================================
  // ✅ DELETE ENTRY (Admin)
  // ======================================================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this entry?")) return;

    await fetch(`http://localhost:5000/api/items/${id}`, {
      method: "DELETE",
    });

    fetchRecords();
  };

// ======================================================
// ✅ DELETE USER (Admin)
// ======================================================
const handleUserDelete = async (id) => {
  if (!window.confirm("Delete this user?")) return;

  await fetch(`http://localhost:5000/api/users/${id}`, {
    method: "DELETE",
  });

  fetchUsers(); // refresh users list
};

// ======================================================
// ✅ DISABLE / ENABLE USER (Admin)
// ======================================================
const handleUserDisable = async (id) => {
  await fetch(`http://localhost:5000/api/users/${id}/disable`, {
    method: "PATCH",
  });

  fetchUsers(); // refresh list
};

  // ======================================================
  // ✅ MARK AS COLLECTED (Admin)
  // ======================================================
  const markCollected = async (id) => {
    await fetch(`http://localhost:5000/api/items/${id}/collect`, {
      method: "POST",
    });

    fetchRecords();
  };

  // ======================================================
  // ✅ FILTER ITEMS BY DATE
  // ======================================================
  const filteredRecords =
    selectedDate === ""
      ? records
      : records.filter((r) => r.postedAt === selectedDate);

  // ======================================================
  // ✅ FILTER USERS BY WARD SEARCH
  // ======================================================
  const filteredUsers =
    wardSearch === ""
      ? users
      : users.filter((u) =>
          u.ward_no.toLowerCase().includes(wardSearch.toLowerCase())
        );

  // ======================================================
  // ✅ EXPORT ITEMS CSV
  // ======================================================
  const exportItemsCSV = () => {
    let csv =
      "ID,Item,Category,Qty,Condition,Posted By,Posted Date,Status,Claimed By,Claimed Date,Collected\n";

    filteredRecords.forEach((r) => {
      csv += `${r.id},${r.itemName},${r.category},${r.quantity},${r.condition},${r.postedBy},${r.postedAt},${r.status},${r.claimedBy},${r.claimedAt},${r.collected}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `RRR_Items_Report_${selectedDate || "ALL"}.csv`;
    link.click();
  };

  // ======================================================
  // ✅ EXPORT USERS CSV
  // ======================================================
  const exportUsersCSV = () => {
    let csv =
      "ID,Name,Email,Phone,Ward No,Address,Registered Date\n";

    filteredUsers.forEach((u) => {
      csv += `${u.id},${u.name},${u.email},${u.phone},${u.ward_no},"${u.address}",${
        u.created_at ? u.created_at.split("T")[0] : "-"
      }\n`;
    });

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `RRR_Users_Report.csv`;
    link.click();
  };

  // ======================================================
  // ✅ UI LAYOUT (Same Style)
  // ======================================================
  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f9" }}>
      {/* HEADER */}
      <div
        style={{
          background: "#0d47a1",
          color: "white",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>RRR Center Admin Dashboard</h1>
          <p style={{ margin: "5px 0 0 0" }}>
            Narmadapuram Municipal Council | नगर पालिका परिषद नर्मदापुरम
          </p>
        </div>

        <button
          onClick={onLogout}
          style={{
            padding: "10px 15px",
            background: "red",
            border: "none",
            color: "white",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div style={{ padding: "30px 40px" }}>
        {/* FILTER + EXPORT ITEMS */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div>
            <label style={{ fontWeight: "bold" }}>Select Date: </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{ padding: "8px", marginLeft: "10px" }}
            />
          </div>

          <button
            onClick={exportItemsCSV}
            style={{
              padding: "10px 15px",
              background: "#2e7d32",
              border: "none",
              color: "white",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ⬇ Download Items Report
          </button>
        </div>

        {/* ITEMS TABLE */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
            marginBottom: "40px",
          }}
        >
          <h2>📋 RRR Entries (From Mobile App)</h2>

          <table
            border="1"
            cellPadding="8"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "15px",
              fontSize: "13px",
            }}
          >
            <thead style={{ background: "#eee" }}>
              <tr>
                <th>ID</th>
                <th>Item</th>
                <th>Category</th>
                <th>Qty</th>
                <th>Condition</th>
                <th>Posted By</th>
                <th>Posted Date</th>
                <th>Status</th>
                <th>Claimed By</th>
                <th>Claimed Date</th>
                <th>Collected</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredRecords.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.itemName}</td>
                  <td>{r.category}</td>
                  <td>{r.quantity}</td>
                  <td>{r.condition}</td>
                  <td>{r.postedBy}</td>
                  <td>{r.postedAt}</td>
                  <td>{r.status}</td>
                  <td>{r.claimedBy}</td>
                  <td>{r.claimedAt}</td>
                  <td>{r.collected}</td>

                  <td>
                    {r.collected === "NO" && (
                      <button
                        onClick={() => markCollected(r.id)}
                        style={{
                          marginRight: "5px",
                          padding: "5px",
                          background: "#1565c0",
                          color: "white",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        Collect
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(r.id)}
                      style={{
                        padding: "5px",
                        background: "red",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {filteredRecords.length === 0 && (
                <tr>
                  <td colSpan="12" style={{ textAlign: "center" }}>
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* USERS COUNT CARD */}
        <div
          style={{
            background: "#ffffff",
            padding: "15px 20px",
            borderRadius: "12px",
            marginBottom: "15px",
            boxShadow: "0px 2px 8px rgba(0,0,0,0.08)",
            fontWeight: "bold",
            fontSize: "16px",
          }}
        >
          👥 Total Registered Users: {users.length}
        </div>

        {/* USERS SEARCH + EXPORT */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "15px",
          }}
        >
          <input
            type="text"
            placeholder="Search by Ward Number..."
            value={wardSearch}
            onChange={(e) => setWardSearch(e.target.value)}
            style={{
              padding: "10px",
              width: "250px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />

          <button
            onClick={exportUsersCSV}
            style={{
              padding: "10px 15px",
              background: "#00695c",
              border: "none",
              color: "white",
              borderRadius: "6px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ⬇ Export Users CSV
          </button>
        </div>

        {/* USERS TABLE */}
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0px 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          <h2>👤 Registered Users (Mobile App)</h2>

          <table
            border="1"
            cellPadding="8"
            style={{
              width: "100%",
              borderCollapse: "collapse",
              marginTop: "15px",
              fontSize: "13px",
            }}
          >
            <thead style={{ background: "#eee" }}>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Ward No</th>
                <th>Address</th>
                <th>Registered Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.phone}</td>
                  <td>{u.ward_no}</td>
                  <td>{u.address}</td>
                  <td>
                    {u.created_at ? u.created_at.split("T")[0] : "-"}
                  </td>
<td>
  {/* ✅ Disable / Enable Button */}
  <button
    onClick={() => handleUserDisable(u.id)}
    style={{
      background: u.is_disabled ? "green" : "orange",
      color: "white",
      border: "none",
      padding: "6px 10px",
      cursor: "pointer",
      borderRadius: "6px",
      marginRight: "6px",
    }}
  >
    {u.is_disabled ? "Enable" : "Disable"}
  </button>

  {/* ✅ Delete Button */}
  <button
    onClick={() => handleUserDelete(u.id)}
    style={{
      background: "red",
      color: "white",
      border: "none",
      padding: "6px 10px",
      cursor: "pointer",
      borderRadius: "6px",
    }}
  >
    Delete
  </button>
</td>

                 </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <p
          style={{
            marginTop: "30px",
            textAlign: "center",
            fontSize: "13px",
            color: "#666",
          }}
        >
          Authorized Municipal Staff Only | केवल अधिकृत कर्मचारियों हेतु <br />
          © 2026 Narmadapuram Municipal Council – RRR Center System
        </p>
      </div>
    </div>
  );
}

export default Dashboard;


function Header() {
  return (
    <header
      style={{
        height: "70px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid #e5e7eb",
        marginBottom: "30px",
      }}
    >
      <div>
        <h2 style={{ margin: 0 }}>CreatorIQ</h2>
        <p
          style={{
            margin: "4px 0 0",
            color: "#6b7280",
            fontSize: "14px",
          }}
        >
          Creator Analytics Dashboard
        </p>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "15px",
        }}
      >
        <span>Profile</span>

        <button
          onClick={() => {
            localStorage.removeItem("access_token");
            window.location.href = "/";
          }}
          style={{
            padding: "8px 14px",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

export default Header;
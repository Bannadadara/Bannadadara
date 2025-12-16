export default function Header() {
  return (
    <header style={{ padding: "16px", display: "flex", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <img src="/logo.png" alt="Logo" height="40" />
        <strong>Bannada Daara</strong>
      </div>

      <a
        href="https://wa.me/918105750221"
        target="_blank"
        style={{
          background: "green",
          color: "white",
          padding: "8px 12px",
          textDecoration: "none",
          borderRadius: "5px"
        }}
      >
        Order on WhatsApp
      </a>
    </header>
  );
}

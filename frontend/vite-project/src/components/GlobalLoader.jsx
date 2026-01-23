// src/components/GlobalLoader.jsx
import { useUi } from "../context/UiContext";

export default function GlobalLoader() {
  const { loading } = useUi();

  if (!loading) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.6)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          background: "#111",
          color: "#fff",
          padding: "20px 30px",
          borderRadius: 8,
          fontSize: 16,
          fontWeight: "bold",
        }}
      >
        Loading...
      </div>
    </div>
  );
}

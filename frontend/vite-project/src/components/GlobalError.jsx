import { useUi } from "../api/UiContext";

export default function GlobalError() {
  const { error, clearError } = useUi();

  if (!error) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 20,
        right: 20,
        background: "#ff4d4f",
        color: "white",
        padding: "12px 16px",
        borderRadius: 6,
        zIndex: 9999,
        minWidth: 250,
      }}
      onClick={clearError}
    >
      {error}
    </div>
  );
}

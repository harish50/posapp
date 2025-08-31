import { useEffect } from "preact/hooks";

export default function Modal({ open, onClose, children }: { open: boolean, onClose: () => void, children: any }) {
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(30,64,175,0.12)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(30,64,175,0.18)",
        padding: "1rem 1.5rem",
        minWidth: "340px",
        maxWidth: "95vw",
        position: "relative"
      }}>
        <button onClick={onClose} style={{ position: "absolute", top: 12, right: 12, background: "none", border: "none", fontSize: "2rem", color: "#1976d2", cursor: "pointer" }}>&times;</button>
        {children}
      </div>
    </div>
  );
}


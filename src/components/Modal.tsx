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
    <div className="modal-overlay">
      <div className="modal-box">
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>
  );
}

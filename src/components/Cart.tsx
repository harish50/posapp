import { useContext } from "preact/hooks";
import { CartContext } from "../core/CartContext";

export default function Cart() {
  const cartCtx = useContext(CartContext);
  const cart = cartCtx?.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={{ padding: "2rem", maxWidth: 600, margin: "2rem auto", background: "#f8f9fa", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", textAlign: "center" }}>Cart</h2>
      {cart.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888" }}>Cart is empty</div>
      ) : (
        <ul className="cart-list">
          {cart.map((item, idx) => (
            <li key={idx} className="cart-item">
              <img src={item.image} alt={item.title} />
              <div className="cart-item-details">
                <div className="cart-title">{item.title}</div>
                <div className="cart-meta">Size: {item.size}</div>
                {item.addons && item.addons.length > 0 && (
                  <div className="cart-addons">Add-ons: {item.addons.join(", ")}</div>
                )}
                {item.specialRequest && (
                  <div className="cart-special">Special: {item.specialRequest}</div>
                )}
                <div className="cart-qty">
                  Qty: {item.quantity} &nbsp;|&nbsp; {item.price * item.quantity}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div style={{ textAlign: "right", fontWeight: 700, fontSize: "1.2rem", marginTop: "1.5rem", color: "#007bff" }}>
        Total: {total.toFixed(2)}
      </div>
    </div>
  );
}

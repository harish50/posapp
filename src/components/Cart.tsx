import { useContext } from "preact/hooks";
import { CartContext } from "../core/CartContext";
import { OrderContext } from "../core/OrderContext";
import type { Order } from "../core/types";

export default function Cart() {
  const cartCtx = useContext(CartContext);
  const orderCtx = useContext(OrderContext);
  const cart = cartCtx?.cart || [];
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = async () => {
    if (!orderCtx || cart.length === 0) return;
    const order: Order = {
      id: Date.now().toString(),
      items: cart,
      status: "Ordered",
      synced: "false",
      createdAt: new Date().toISOString(),
    };
    await orderCtx.placeOrder(order);
    if (cartCtx) cartCtx.cart.forEach(item => cartCtx.removeFromCart(item.id, { size: item.size, addons: item.addons, specialRequest: item.specialRequest }));
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 600, margin: "2rem auto", background: "#f8f9fa", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem", textAlign: "center" }}>Cart</h2>
      {cart?.length === 0 ? (
        <div style={{ textAlign: "center", color: "#888" }}>Cart is empty</div>
      ) : (
        <ul className="cart-list">
          {cart.map((item) => (
            <li key={item.id} className="cart-item">
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
              <button
                style={{ marginLeft: '1rem', background: '#e53935', color: '#fff', border: 'none', borderRadius: '6px', padding: '0.5rem 1rem', cursor: 'pointer', fontWeight: 600 }}
                onClick={() => cartCtx?.removeFromCart(item.id, { size: item.size, addons: item.addons, specialRequest: item.specialRequest })}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
      <div style={{ textAlign: "right", fontWeight: 700, fontSize: "1.2rem", marginTop: "1.5rem", color: "#007bff" }}>
        Total: {total.toFixed(2)}
      </div>
      <div style={{ textAlign: "right", marginTop: "2rem" }}>
        <button
          style={{ background: '#1976d2', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.7rem 2rem', fontWeight: 600, fontSize: '1.1rem', cursor: 'pointer' }}
          disabled={cart.length === 0}
          onClick={handleOrder}
        >
          Order
        </button>
      </div>
    </div>
  );
}

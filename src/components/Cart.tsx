import {useContext} from "preact/hooks";
import {CartContext} from "../contexts/CartContext.tsx";
import {OrderContext} from "../contexts/OrderContext.tsx";
import type {Order} from "../core/types";

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
      syncStatus: "pending",
      lastModified: Date.now(),
      createdAt: new Date().toISOString(),
    };
    await orderCtx.placeOrder(order);
    if (cartCtx) {
      cartCtx.cart.forEach(item => cartCtx.removeFromCart(item.id, {
        size: item.size,
        addons: item.addons,
        specialRequest: item.specialRequest
      }));
    }
  };

  return (
    <div className="cart-container">
      <h2>Cart</h2>
      {cart?.length === 0 ? (
        <div style={{textAlign: "center", color: "#888"}}>Cart is empty</div>
      ) : (
        <ul className="cart-list">
          {cart.map((item) => (
            <li key={`${item.id}-${item.size}`} className="cart-item">
              <img src={item.image} alt={item.title}/>
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
                className="cart-delete-btn"
                onClick={() => cartCtx?.removeFromCart(item.id, {
                  size: item.size,
                  addons: item.addons,
                  specialRequest: item.specialRequest
                })}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
      <div className="cart-total">
        Total: <span className="cart-total-value">{total.toFixed(2)}</span>
      </div>
      <div style={{textAlign: "right", marginTop: "2rem"}}>
        <button
          className={`cart-order-btn${cart.length === 0 ? " cart-order-btn-disabled" : ""}`}
          disabled={cart.length === 0}
          onClick={handleOrder}
          tabIndex={0}
          aria-label="Place Order"
        >
          Order
        </button>
      </div>
    </div>
  );
}

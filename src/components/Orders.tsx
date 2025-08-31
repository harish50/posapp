import { useContext } from "preact/hooks";
import { OrderContext } from "../contexts/OrderContext.tsx";

export default function Orders() {
  const {orders, orderStatus} = useContext(OrderContext);

  return (
    <div className="orders-container">
      <h3 className="orders-title">Orders</h3>
      {orders.length === 0 ? (
        <div className="orders-empty">No orders yet.</div>
      ) : (
        <ul className="orders-list">
          {orders.map(order => (
            <li key={order.id} className="orders-item">
              <div className="orders-id">Order #{order.id}</div>
              <div className="orders-status">
                Status: <span className="orders-status-value">{orderStatus[order.id]}</span>
              </div>
              <div className="orders-items">
                {order.items.map((item, index) => (
                  <div key={index}>
                    {item.title} x{item.quantity} ({item.size})
                    {item.addons && item.addons.length > 0 && ` | Add-ons: ${item.addons.join(', ')}`}
                    {item.specialRequest && ` | Special: ${item.specialRequest}`}
                  </div>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

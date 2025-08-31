import { useContext } from "preact/hooks";
import { OrderContext } from "../core/OrderContext";

export default function Orders() {
  const orderCtx = useContext(OrderContext);

  return (
    <div style={{ marginTop: '2rem', background: '#fff', borderRadius: '14px', boxShadow: '0 2px 12px rgba(30,64,175,0.07)', padding: '2rem 1.5rem', minWidth: 340, maxWidth: 600 }}>
      <h3 style={{ color: '#1a237e', marginBottom: '1rem', textAlign: 'center' }}>Orders</h3>
      {orderCtx?.orders.length === 0 ? (
        <div style={{ color: '#888', textAlign: 'center' }}>No orders yet.</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {orderCtx?.orders.map(order => (
            <li key={order.id} style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 4px rgba(30,64,175,0.04)', marginBottom: '1rem', padding: '1rem' }}>
              <div style={{ fontWeight: 600, color: '#1976d2' }}>Order #{order.id}</div>
              <div style={{ fontSize: '0.98rem', color: '#555' }}>Status: <span style={{ fontWeight: 700 }}>{orderCtx.orderStatus[order.id]}</span></div>
              <div style={{ fontSize: '0.95rem', color: '#333', marginTop: '0.5rem' }}>
                {order.items.map((item) => (
                  <div key={item.id}>
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


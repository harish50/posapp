import './app.css'
import ItemList from "./components/ItemList.tsx";
import { CartProvider } from "./core/CartContext";
import Cart from "./components/Cart";
import { OrderProvider } from "./core/OrderContext";
import Orders from "./components/Orders";

export function App() {
  return (
    <OrderProvider>
      <CartProvider>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', maxWidth: 1800, margin: '0 auto' }}>
          <div style={{ flex: 2 }}>
            <ItemList/>
          </div>
          <div style={{ flex: 1 }}>
            <Cart/>
            <Orders/>
          </div>
        </div>
      </CartProvider>
    </OrderProvider>
  )
}

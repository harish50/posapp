import './app.css'
import ItemList from "./components/ItemList.tsx";
import { CartProvider } from "./core/CartContext";
import Cart from "./components/Cart";

export function App() {
  return (
    <CartProvider>
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', maxWidth: 1800, margin: '0 auto' }}>
        <div style={{ flex: 2 }}>
          <ItemList/>
        </div>
        <div style={{ flex: 1 }}>
          <Cart/>
        </div>
      </div>
    </CartProvider>
  )
}

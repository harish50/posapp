import './app.css'
import ItemList from "./components/ItemList.tsx";
import { CartProvider } from "./contexts/CartContext.tsx";
import Cart from "./components/Cart";
import { OrderProvider } from "./contexts/OrderContext.tsx";
import Orders from "./components/Orders";
import {OfflineDataStore} from "./core/OfflineDataStore.ts";
import {useEffect} from "preact/hooks";

export function App() {
  const offlineDataStore = new OfflineDataStore();

  useEffect(() => {
    window.addEventListener('online', ()=>{
      offlineDataStore.syncItems();
      offlineDataStore.syncOrders();
    })
  }, []);

  return (
    <OrderProvider>
      <CartProvider>
        <div className="app-container">
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

import {useState, useEffect} from "preact/hooks";
import {OfflineDataStore} from "../core/OfflineDataStore";
import type {Item} from "../core/types.ts";

export default function ItemList(){
  const [items, setItems] = useState<Item[]>([])
  const offlineStore = new OfflineDataStore();

  useEffect(() => {
    const loadItems= async () => {
      const offlineItems = await offlineStore.loadItems();
      setItems(offlineItems)
    }

    loadItems()
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: 1200, margin: '0 auto' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>Items</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '2rem',
      }}>
        {items.map((item) => (
          <div key={item.itemID} style={{
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '200px',
          }}>
            <img src={item.imageUrl} alt={item.itemName} style={{
              width: '120px',
              height: '120px',
              objectFit: 'contain',
              marginBottom: '1rem',
            }} />
            <strong style={{ color: '#222', fontSize: '1.1rem', marginBottom: '0.5rem', textAlign: 'center' }}>{item.itemName}</strong>
            <span style={{ color: '#007bff', fontWeight: 600, fontSize: '1.2rem', marginTop: '10px' }}>{item.itemPrice}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
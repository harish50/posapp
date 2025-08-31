import { useContext, useState, useEffect } from "preact/hooks";
import { OfflineDataStore } from "../core/OfflineDataStore";
import { CartContext } from "../core/CartContext";
import type { Item } from "../core/types.ts";
import Modal from "./Modal";

const SIZES = ["Small", "Medium", "Large"];
const ADDONS = ["Extra Cheese", "Spicy Sauce", "Double Meat"];

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const offlineStore = new OfflineDataStore();
  const cartCtx = useContext(CartContext);
  const [formState, setFormState] = useState<{ [key: string]: any }>({});
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState<Item | null>(null);
  const [modalState, setModalState] = useState<any>({});
  const [search, setSearch] = useState("");

  useEffect(() => {
    const loadItems = async () => {
      if (search.trim() === "") {
        const offlineItems = await offlineStore.loadItems();
        setItems(offlineItems);
      } else {
        const matched = await offlineStore.searchItemsByName(search);
        console.log(matched, search);
        setItems(matched);
      }
    };
    loadItems();
  }, [search]);

  const openModal = (item: Item) => {
    setModalItem(item);
    setModalState(formState[item.itemID] || {});
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setModalItem(null);
    setModalState({});
  };
  const handleModalChange = (field: string, value: any) => {
    setModalState((prev: any) => ({ ...prev, [field]: value }));
  };
  const confirmAddToCart = () => {
    if (!modalItem) return;
    cartCtx?.addToCart({
      id: modalItem.itemID,
      title: modalItem.itemName,
      price: modalItem.itemPrice,
      image: modalItem.imageUrl,
      size: modalState.size || SIZES[0],
      addons: modalState.addons || [],
      specialRequest: modalState.specialRequest || "",
      quantity: 1,
    });
    setFormState((prev) => ({ ...prev, [modalItem.itemID]: modalState }));
    closeModal();
  };

  const handleSearchChange = (e: any) => {
    setSearch(e.currentTarget.value);
    console.log(e.currentTarget.value);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: 1200, margin: "0 auto" }}>
      <h2 style={{ fontSize: "2rem", marginBottom: "2rem", textAlign: "center" }}>Items</h2>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search items by name..."
          style={{
            padding: "0.7rem 1.2rem",
            borderRadius: "8px",
            border: "1px solid #cfd8dc",
            fontSize: "1.1rem",
            width: "60%"
          }}
        />
      </div>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "2rem",
      }}>
        {items.map((item) => {
          return (
            <div key={item.itemID} className="product-card">
              <img src={item.imageUrl} alt={item.itemName} />
              <strong>{item.itemName}</strong>
              <span className="price">{item.itemPrice}</span>
              <button onClick={() => openModal(item)}>
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>
      <Modal open={modalOpen} onClose={closeModal}>
        {modalItem && (
          <div>
            <h3 style={{ marginBottom: '1rem', color: '#1a237e' }}>Customise {modalItem.itemName}</h3>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Size:
              <select value={modalState.size || SIZES[0]} onChange={e => handleModalChange("size", e.currentTarget.value)} style={{ marginLeft: "0.5rem" }}>
                {SIZES.map(size => <option key={size} value={size}>{size}</option>)}
              </select>
            </label>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Add-ons:
              <div>
                {ADDONS.map(addon => (
                  <label key={addon} style={{ marginRight: "1rem" }}>
                    <input
                      type="checkbox"
                      checked={modalState.addons?.includes(addon) || false}
                      onChange={e => {
                        const checked = e.currentTarget.checked;
                        handleModalChange("addons", checked
                          ? [...(modalState.addons || []), addon]
                          : (modalState.addons || []).filter((a: string) => a !== addon)
                        );
                      }}
                    /> {addon}
                  </label>
                ))}
              </div>
            </label>
            <label style={{ display: "block", marginBottom: "0.5rem" }}>
              Special Request:
              <input
                type="text"
                value={modalState.specialRequest || ""}
                onChange={e => handleModalChange("specialRequest", e.currentTarget.value)}
                style={{ marginLeft: "0.5rem", width: "80%" }}
              />
            </label>
            <button style={{ marginTop: "1rem" }} onClick={confirmAddToCart}>
              Add to Cart
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
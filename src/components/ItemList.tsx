import { useContext, useState, useEffect } from "preact/hooks";
import { OfflineDataStore } from "../core/OfflineDataStore";
import { CartContext } from "../contexts/CartContext.tsx";
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
    window.addEventListener("online", ()=>{
      loadItems();
    });
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
    <div className="item-list-container">
      <h2 className="item-list-title">Items</h2>
      <div className="item-list-search">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search items by name..."
          className="item-search-input"
        />
      </div>
      <div className="item-list-grid">
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
          <div className="modal-content">
            <h3 className="modal-title">Customise {modalItem.itemName}</h3>
            <label className="modal-label">
              Size:
              <select
                value={modalState.size || SIZES[0]}
                onChange={e => handleModalChange("size", e.currentTarget.value)}
                className="modal-select"
              >
                {SIZES.map(size => <option key={size} value={size}>{size}</option>)}
              </select>
            </label>
            <label className="modal-label">
              Add-ons:
              <div className="modal-addons">
                {ADDONS.map(addon => (
                  <label key={addon} className="modal-addon-label">
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
            <label className="modal-label">
              Special Request:<input
                type="text"
                value={modalState.specialRequest ?? ""}
                onChange={e => handleModalChange("specialRequest", e.currentTarget.value)}
                className="modal-input"
              />
            </label>
            <button className="modal-add-btn" onClick={confirmAddToCart}>
              Add to Cart
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
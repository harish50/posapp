# POS App

This is a simple Point-of-Sale (POS) application built with Preact. It allows users to browse items, add them to a cart, customize orders, and manage orders.

## How to Run

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the development server:**
   ```bash
   npm run dev
   ```
3. **Open your browser:**

   Visit [http://localhost:5173](http://localhost:5173) to use the app.

4. **Build for production:**
   ```bash
   npm run build
   ```
5. **Preview the production build:**
   ```bash
   npm run preview
   ```

## Features

- **Item List:** Browse available products, search by name, and view details.
- **Add to Cart:** Select size, add-ons, and special requests for each item before adding to the cart.
- **Cart Management:** View items in the cart, adjust quantities, and remove items.
- **Order Placement:** Place orders from the cart. Orders are tracked with status and details.
- **Order History:** View all placed orders with item breakdown and status.
- **Modal Dialogs:** Customization and cart actions use modal dialogs for a smooth user experience.
- **Styling:** All UI components use CSS classes for consistent styling.

## Structure

- `src/components/ItemList.tsx`: Displays products and handles adding to cart.
- `src/components/Cart.tsx`: Shows cart contents and allows order placement.
- `src/components/Orders.tsx`: Displays order history and statuses.
- `src/components/Modal.tsx`: Reusable modal dialog component.
- `src/app.css`: Contains all styles for the app.

## Usage

1. Start the app.
2. Search and select items to add to your cart.
3. Customize items as needed.
4. View and manage your cart.
5. Place orders and track their status.

## Customization

You can easily add new products, sizes, or add-ons by updating the relevant data sources and components.

---

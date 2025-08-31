### Answer the following questions with detailed explanations:

1. Offline-First Architecture (15 minutes)
   - Design a data synchronization strategy for orders, inventory, and menu items
     - Use local storage (e.g., IndexedDB) for offline data persistence and whenever we create new order/item create a record in local storage and sync to server if connected to internet
     - Use a background sync mechanism to periodically check for connectivity and sync data when online
   - How would you handle conflict resolution when multiple devices modify the same data offline?
     - we can use a last-write-wins strategy based on timestamps, or implement a more complex merge strategy depending on the data type
   - Describe your approach to ensuring data consistency across devices
     - Use WebSockets or a similar real-time communication protocol to push updates to all connected devices when changes occur
2. Performance Constraints (15 minutes)
   - The system runs on Android tablets with 2GB RAM and older ARM processors
   - How would you optimize JavaScript bundle size and runtime performance?
     - Optimize the assets by minifying and compressing the JavaScript bundle, use code-splitting to load only necessary parts of the app, and leverage tree-shaking to remove unused code
   - Describe strategies for efficient DOM manipulation and memory management
     - Use virtual DOM libraries (like Preact) to minimize direct DOM manipulations, batch updates to reduce reflows, and implement lazy loading for images and other heavy resources
     - Don't load all data at once, use pagination or infinite scrolling for large lists
3. Multi-Device Coordination (15 minutes)
   - How would you implement real-time order status updates between kitchen display and cashier devices?
     - Use WebSockets or a similar real-time communication protocol to push order status updates to all connected devices
   - Design a queuing system for print jobs when multiple devices share a thermal printer
     - Implement a centralized print server that manages a queue of print jobs, ensuring that jobs are processed in the order they are received
     - Use acknowledgments from the printer to confirm job completion before sending the next job
   - Explain your approach to device discovery and pairing in a local network
     - Use mDNS (Multicast DNS) or a similar protocol to allow devices to discover each other on the same local network
     - Implement a simple pairing process using QR codes or unique device identifiers to establish trust between devices
4. Data Storage Strategy (15 minutes)
   - Compare IndexedDB, WebSQL, and localStorage for your use case
     - IndexedDB is the most suitable choice for this application due to its ability to handle large amounts of structured data, support for transactions, and asynchronous API
     - localStorage is limited in size and is synchronous, which can block the main thread
     - WebSQL is deprecated and not supported in all browsers
   - How would you implement efficient local querying for large product catalogs?
     - Use IndexedDB's indexing capabilities to create indexes on frequently queried fields (e.g., product name, category)
     - Implement pagination or infinite scrolling to load only a subset of products at a time
   - Design a data pruning strategy to manage storage limitations
     - Implement a data retention policy that automatically deletes old or unused data after a certain period
     - Provide users with options to manually clear cached data or reset the app
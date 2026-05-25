import { createContext, useContext, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const stored = localStorage.getItem('greencare_cart');
    return stored ? JSON.parse(stored) : [];
  });

  const sync = (nextItems) => {
    setItems(nextItems);
    localStorage.setItem('greencare_cart', JSON.stringify(nextItems));
  };

  const addToCart = (product, quantity = 1) => {
    if (product.stockQuantity <= 0) throw new Error('This product is out of stock.');
    if (product.requiresPrescription) throw new Error('Prescription products cannot be checked out in this demo.');

    const existing = items.find((item) => item.product.id === product.id);
    const nextItems = existing
      ? items.map((item) => item.product.id === product.id
        ? { ...item, quantity: Math.min(item.quantity + quantity, product.stockQuantity) }
        : item)
      : [...items, { product, quantity }];

    sync(nextItems);
  };

  const updateQuantity = (productId, quantity) => {
    const nextItems = items
      .map((item) => item.product.id === productId
        ? { ...item, quantity: Math.max(1, Math.min(Number(quantity), item.product.stockQuantity)) }
        : item)
      .filter((item) => item.quantity > 0);
    sync(nextItems);
  };

  const removeItem = (productId) => sync(items.filter((item) => item.product.id !== productId));
  const clearCart = () => sync([]);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const value = useMemo(() => ({
    items,
    subtotal,
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  }), [items, subtotal]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

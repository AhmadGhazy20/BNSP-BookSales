import { createContext, useContext, useEffect, useState } from 'react';

const CART_KEY = 'cart';
const CartContext = createContext();

function readCart() {
    try {
        const saved = localStorage.getItem(CART_KEY);
        const parsed = saved ? JSON.parse(saved) : [];

        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

export function CartProvider({ children }) {
    const [items, setItems] = useState(readCart);

    useEffect(() => {
        localStorage.setItem(CART_KEY, JSON.stringify(items));
    }, [items]);

    const addToCart = (book, quantity = 1) => {
        if (!book || Number(book.stock) < 1) {
            return false;
        }

        setItems((previousItems) => {
            const existingItem = previousItems.find((item) => item.id === book.id);
            const stock = Number(book.stock);

            if (existingItem) {
                return previousItems.map((item) =>
                    item.id === book.id
                        ? {
                              ...item,
                              price: Number(book.price),
                              stock,
                              quantity: Math.min(item.quantity + quantity, stock),
                          }
                        : item
                );
            }

            return [
                ...previousItems,
                {
                    id: book.id,
                    title: book.title,
                    price: Number(book.price),
                    stock,
                    author: book.author?.name || '',
                    genre: book.genre?.name || '',
                    quantity: Math.min(quantity, stock),
                },
            ];
        });

        return true;
    };

    const removeFromCart = (id) => {
        setItems((previousItems) =>
            previousItems.filter((item) => item.id !== id)
        );
    };

    const updateQuantity = (id, quantity) => {
        setItems((previousItems) =>
            previousItems.map((item) => {
                if (item.id !== id) {
                    return item;
                }

                const nextQuantity = Number(quantity) || 1;

                return {
                    ...item,
                    quantity: Math.max(1, Math.min(nextQuantity, item.stock)),
                };
            })
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const totalItems = items.reduce(
        (total, item) => total + Number(item.quantity),
        0
    );

    const totalPrice = items.reduce(
        (total, item) => total + Number(item.price) * Number(item.quantity),
        0
    );

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}

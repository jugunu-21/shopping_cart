"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [cart, setCart] = useState<{ id: number; quantity: number }[]>([]);
  const [freeGiftAdded, setFreeGiftAdded] = useState(false);
  const PRODUCTS = [
    { id: 1, name: "Laptop", price: 500 },
    { id: 2, name: "Smartphone", price: 300 },
    { id: 3, name: "Headphones", price: 100 },
    { id: 4, name: "Smartwatch", price: 150 },
  ];

  const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
  const THRESHOLD = 1000;
  const addToCart = (ProductId: number) => {
    console.log("cart", cart);
    setCart((prevCart) => {
      const exsistingItem = prevCart.find((item) => item.id === ProductId);
      if (exsistingItem) {
        return prevCart.map((item) =>
          item.id === ProductId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { id: ProductId, quantity: 1 }];
    });
  };
  const updateQunatity = (ProductId: number, delta: number) => {
    setCart((prevCart) => {
      const newCart = prevCart
        .map((item) => {
          if (item.id === ProductId) {
            const newQunatity = Math.max(0, item.quantity + delta);
            return { ...item, quantity: newQunatity };
          }

          return item;
        })
        .filter((item) => item.quantity > 0);
      return newCart;
    });
  };
  const calculateSubtotal = () => {
    return cart.reduce((total, item) => {
      const product = PRODUCTS.find((p) => p.id === item.id);
      return total + (product?.price || 0) * item.quantity;
    }, 0);
  };
  useEffect(() => {
    const subtotal = calculateSubtotal();
    if (subtotal >= THRESHOLD && !freeGiftAdded) {
      setFreeGiftAdded(true);
      setCart((prevCart) => [...prevCart, { id: FREE_GIFT.id, quantity: 1 }]);
    } else if (subtotal < THRESHOLD && freeGiftAdded) {
      setFreeGiftAdded(false);
      setCart((prevCart) =>
        prevCart.filter((item) => item.id !== FREE_GIFT.id)
      );
    }
    console.log("hhe33", freeGiftAdded);
  }, [cart, freeGiftAdded]);
  const subtotal = calculateSubtotal();
  const progress = Math.min((subtotal / THRESHOLD) * 100, 100);
  return (
    <main className="p-8 bg-gray-50 min-h-screen text-black">
      <div>
        <h1 className="text-2xl font-bold mb-8 ">Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PRODUCTS.map((product, index) => {
            return (
              <div key={index} className=" bg-white p-6 rounded-lg shadow-sm">
                <h3 className="">{product.name}</h3>
                <p>{product.price}</p>
                <button
                  className="w-full mt-4 bg-blue-500 text-white py-2 px-4 rounded-md "
                  onClick={() => addToCart(product.id)}
                >
                  Add to cart
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <section className="mt-12">
        <div>
          <h1 className="text-2xl font-bold mb-8 "> cart Summary</h1>
          <div className="text-lg font mdeium text-gray">Subtotal</div>
          {!freeGiftAdded && (
            <div className="space-y-2">
              <div className=" h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-blue-800 transition-all duration-300  "
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className=" mt-4 text-sm text-gray-500">
                Add Rs{Math.max(0, THRESHOLD - subtotal)} more to get a free
                wireless Mouse!
              </p>
            </div>
          )}

          {freeGiftAdded && <p>You got a free wireless Mouse!</p>}
        </div>
      </section>
      <section className="mt-8">
        <h1 className="text-2xl font-bold mb-8 ">Cart Items</h1>
        {cart.length > 0 ? (
          <div>
            {cart.map((item) => {
              const product = [...PRODUCTS, FREE_GIFT].find(
                (p) => p.id === item.id
              );
              if (!product) return null;

              const isGift = product.id == FREE_GIFT.id;
              const itemTotal = product.price * item.quantity;
              return (
                <div key={item.id} className="bg-white rouded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">
                        {product.name}
                      </h3>
                      <p>
                        Rs :-{product.price}*{item.quantity}=Rs{itemTotal}
                      </p>
                    </div>
                    {isGift ? (
                      <span className=""> free Gift</span>
                    ) : (
                      <div className="flex items-center space-x-4">
                        <button
                          className=" w-8 h-8 flex item-center justify-center bg-red-500 txet-white rounded-md hover-bg-red-600 transition-colors"
                          onClick={() => {
                            updateQunatity(item.id, -1);
                          }}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className=" w-8 h-8 flex item-center justify-center bg-red-500 txet-white rounded-md hover-bg-red-600 transition-colors"
                          onClick={() => {
                            updateQunatity(item.id, 1);
                          }}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p> your cart is empty</p>
        )}
      </section>
    </main>
  );
}

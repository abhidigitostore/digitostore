// app/cart/page.tsx
'use client';

import { useState } from 'react'; // --- ADDED: Import useState ---
import { useCart } from '@/lib/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import RequestForm from '@/app/components/RequestForm'; // --- ADDED: Import RequestForm ---

// Define the shape of a cart item
// This should match the interface in your CartContext.tsx
interface CartItem {
  _id: string;
  title: string;
  price: number;
  imageUrl?: string;
}

export default function CartPage() {
  const { state, dispatch } = useCart();
  const { cartItems } = state;

  // --- ADDED: State to manage form visibility ---
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleRemove = (item: CartItem) => {
    dispatch({
      type: 'REMOVE_ITEM',
      payload: { _id: item._id },
    });
  };

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price, 0);

  // ... (empty cart JSX remains the same) ...
  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Please add items to cart for purchase.</p>
        <Link 
          href="/" 
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    // --- ADDED: A fragment to wrap the page and the modal ---
    <>
      <div className="container mx-auto p-4 md:p-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ... (Item List JSX remains the same) ... */}
          <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div key={item._id} className="flex items-center border rounded-lg p-4 shadow-sm">
              <div className="relative h-24 w-24 mr-4 rounded-md overflow-hidden">
                {item.imageUrl ? (
                  <Image src={item.imageUrl} alt={item.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"/>
                ) : (
                  <div className="h-full w-full bg-gray-200"></div>
                )}
              </div>
              <div className="flex-grow">
                <h2 className="font-semibold text-lg">{item.title}</h2>
                <p className="font-bold text-gray-800">₹{item.price.toLocaleString('en-IN')}</p>
              </div>
              <button onClick={() => handleRemove(item)} className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200">
                Remove
              </button>
            </div>
          ))}
        </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 shadow-sm bg-gray-50">
              <h2 className="text-2xl font-semibold mb-4 border-b pb-4">Order Summary</h2>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold text-xl border-t pt-4">
                <span>Total</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
              {/* --- CHANGED: Added onClick handler --- */}
              <button 
                onClick={() => setIsFormVisible(true)}
                className="w-full mt-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* --- ADDED: Conditionally render the form modal --- */}
      {isFormVisible && (
        <RequestForm
          totalAmount={totalPrice}
          cartItems={cartItems}
          onClose={() => setIsFormVisible(false)}
        />
      )}
    </>
  );
}
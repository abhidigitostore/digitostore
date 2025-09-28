// app/components/AddToCartButton.tsx
'use client';

import { useCart } from '@/lib/context/CartContext'; // Adjust path if needed

// Define the shape of the document prop
// This should match the 'Document' interface in your page.tsx
interface Document {
  _id: string;
  title: string;
  price: number;
  imageUrl?: string;
}

interface AddToCartButtonProps {
  doc: Document;
}

export default function AddToCartButton({ doc }: AddToCartButtonProps) {
  const { state, dispatch } = useCart();

  // Check if the current item is already in the cart
  const isInCart = state.cartItems.some(item => item._id === doc._id);

  const handleAddToCart = () => {
    if (isInCart) return; // Do nothing if it's already there

    dispatch({
      type: 'ADD_ITEM',
      payload: doc,
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isInCart}
      className={`w-full mt-4 px-4 py-2 font-semibold text-white rounded-lg transition-colors duration-300
        ${
          isInCart
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
    >
      {isInCart ? 'Added ✓' : 'Add to Cart'}
    </button>
  );
}
// app/components/CartIcon.tsx
'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/context/CartContext'; // Adjust path if needed

export default function CartIcon() {
  const { state } = useCart();
  const itemCount = state.cartItems.length;

  return (
    <Link href="/cart" className="relative flex items-center justify-center p-2 rounded-full hover:bg-gray-100 transition-colors">
      <ShoppingCart className="h-6 w-6 text-gray-700" />
      
      {/* Badge for item count */}
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
          {itemCount}
        </span>
      )}
    </Link>
  );
}
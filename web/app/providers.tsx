// app/providers.tsx
'use client';

import { CartProvider } from '../lib/context/CartContext'; // Adjust path if needed

// This is a client component that wraps your providers
export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      {children}
    </CartProvider>
  );
}
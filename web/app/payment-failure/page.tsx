// web/app/payment-failure/page.tsx
import Link from 'next/link';

export default function PaymentFailure() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Payment Failed ❌</h1>
      <p className="text-lg mb-6">Unfortunately, we could not process your payment. Please try again.</p>
      <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Back to Home
      </Link>
    </div>
  );
}
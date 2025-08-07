// web/app/payment-success/page.tsx
import Link from 'next/link';

export default function PaymentSuccess() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Payment Successful! ✅</h1>
      <p className="text-lg mb-6">Thank you for your payment. You will receive an email with the document link shortly.</p>
      <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Back to Home
      </Link>
    </div>
  );
}
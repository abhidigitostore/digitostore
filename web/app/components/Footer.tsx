// web/app/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center p-4 mt-8">
      <div className="container mx-auto text-gray-600">
        <p className="mb-2">
          <strong>Our Other Services:</strong> AI-powered automation solutions, custom data scraping, and business process optimization.
        </p>
        {/* policy links */}
        <div className="flex justify-center gap-4 mb-4 text-sm">
          <Link href="/terms-and-conditions" className="text-blue-600 hover:underline">Terms & Conditions</Link>
          <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>
          <Link href="/cancellation-and-refunds" className="text-blue-600 hover:underline">Refunds</Link>
          <Link href="/contact-us" className="text-blue-600 hover:underline">Contact Us</Link>
          <Link href="/shipping-policy" className="text-blue-600 hover:underline">Shipping Policy</Link>
        </div>

        {/* Admin dashboard login link */}
        <div className="text-sm">
          <Link href="/login" className="text-blue-600 hover:underline">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
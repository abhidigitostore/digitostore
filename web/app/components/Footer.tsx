// web/app/components/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-center p-4 mt-8">
      <div className="container mx-auto text-gray-600">
        <p className="mb-2">
          <strong>Our Other Services:</strong> AI-powered automation solutions, custom data scraping, and business process optimization.
        </p>
        {/* Add the login link here */}
        <div className="text-sm">
          <Link href="/login" className="text-blue-600 hover:underline">
            Admin Login
          </Link>
        </div>
      </div>
    </footer>
  );
}
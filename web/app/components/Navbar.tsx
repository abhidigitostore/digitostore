// web/app/components/Navbar.tsx
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Left Side: Brand Name and Intro */}
        <div>
          <h1 className="text-xl font-bold">AutoMeta AI</h1>
          <p className="text-sm text-gray-400">AI Automations & Data Services</p>
        </div>

        {/* Right Side: Main Website Link */}
        <Link 
          href="https://www.autometa-ai.com/" // <-- Replace with your client's actual website
          target="_blank" // Opens the link in a new tab
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          Services and Products
        </Link>
        </div>
    </nav>
  );
}
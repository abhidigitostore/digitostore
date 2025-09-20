// web/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Script from 'next/script'; // 1. Import the Script component


export const metadata: Metadata = {
  title: "AutoMeta AI", // agency name
  description: "Securely access our data files.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <body>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow container mx-auto">{children}</main>
          <Footer />
        </div>
        {/* 2. Use the Next.js Script component */}
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </body>
    </html>
  );
}
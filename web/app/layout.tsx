// web/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Script from 'next/script';
import { AppProviders } from './providers'; // 1. Import your new providers component

export const metadata: Metadata = {
  title: "AutoMeta AI",
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
        {/* 2. Wrap your application content with AppProviders */}
        <AppProviders>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto">{children}</main>
            <Footer />
          </div>
        </AppProviders>
        <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      </body>
    </html>
  );
}
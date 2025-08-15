// web/app/privacy-policy/page.tsx

export default function PrivacyPolicyPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <div className="space-y-4">
        <p>
          <strong>Last updated: August 15, 2025</strong>
        </p>
        <p>
          Your privacy is important to us. This policy explains what information we collect and how we use it.
        </p>

        <h2 className="text-2xl font-semibold pt-4">1. Information We Collect</h2>
          <p>When you request a file, we collect the following information:</p>
          <ul>
            <li>Name</li>
            <li>Email Address</li>
            <li>Purpose of Use (Personal or Business)</li>
          </ul>
          <p>We do not collect or store any sensitive payment information like credit card numbers. This is handled securely by our payment gateway partner.</p>

        <h2 className="text-2xl font-semibold pt-4">2. How We Use Your Information</h2>
        <p>We use the information we collect for the following purposes:</p>
        <ul className="list-disc list-inside space-y-2">
          <li>To process your transaction and verify payment.</li>
          <li>To deliver the digital product to your email address.</li>
          <li>For our own internal record-keeping and analytics.</li>
        </ul>
        <p>
          We will not sell, distribute, or lease your personal information to third parties for marketing purposes.
        </p>

        <h2 className="text-2xl font-semibold pt-4">3. Data Security</h2>
        <p>We are committed to ensuring that your information is secure. We use trusted third-party services (Sanity.io, Vercel) to store and manage data with appropriate security measures in place.</p>

        <h2 className="text-2xl font-semibold pt-4">4. Contact</h2>
        <p>If you have any questions about our privacy practices, please contact us at abhi.digitostore@gmail.com</p>
      </div>
    </div>
  );
}
// web/app/terms-and-conditions/page.tsx

export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      <div className="space-y-4">
        <p>
          <strong>Last updated: August 15, 2025</strong>
        </p>
        <p>Welcome to AutoMeta AI. By accessing our website and purchasing our digital products, you agree to be bound by the following terms and conditions.</p>
        
        <h2 className="text-2xl font-semibold pt-4">1. Use of Data</h2>
        <p>
          The data files purchased from this website are provided for your use as indicated at the time of purchase <b>Personal Use</b> or <b>Business Use</b>. You agree not to resell, redistribute, or use the data for any illegal or malicious purposes.
        </p>
        
        <h2 className="text-2xl font-semibold pt-4">2. Payment and Delivery</h2>
        <p>
          All payments are processed through a secure third-party payment gateway. Upon successful payment confirmation, the digital file will be delivered to the email address you provided.
        </p>

        <h2 className="text-2xl font-semibold pt-4">3. Intellectual Property</h2>
        <p>All content and data files on this website are the property of AutoMeta AI. Your purchase grants you a license to use the data but does not transfer ownership.</p>

        <h2 className="text-2xl font-semibold pt-4">4. No Refunds</h2>
        <p>As stated in our Refund Policy, all sales of digital products are final and non-refundable.</p>

        <h2 className="text-2xl font-semibold pt-4">5. Limitation of Liability</h2>
        <p>AutoMeta AI is not liable for any direct, indirect, or consequential damages arising from the use or inability to use the data provided. The data is provided on an <b>as is</b> basis without warranties of any kind.</p>

        <h2 className="text-2xl font-semibold pt-4">6. Contact</h2>
        <p>For any questions regarding these terms, please contact us at abhi.digitostore@gmail.com</p>
      </div>
    </div>
  );
}
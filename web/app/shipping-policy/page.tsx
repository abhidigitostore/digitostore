// web/app/shipping-policy/page.tsx

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Shipping & Delivery Policy</h1>
      <div className="space-y-4">
        <p>
          <strong>Last updated: August 15, 2025</strong>
        </p>
        <p>
          All products sold on this website are digital goods and are delivered electronically via email. 
          There is no physical shipping of any products.
        </p>
        <h2 className="text-2xl font-semibold pt-4">Delivery Timeframe</h2>
        <p>
          Your digital file will be delivered to the email address provided during checkout (Request form for file) immediately after a successful payment.
        </p>
      </div>
    </div>
  );
}
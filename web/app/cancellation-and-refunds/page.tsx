// web/app/cancellation-and-refunds/page.tsx

export default function CancellationAndRefundsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Cancellation & Refund Policy</h1>
      <div className="space-y-4">
        <strong>Last Updated:</strong> August 15, 2025
        Thank you for your purchase from AutoMeta AI.

        <h2 className="text-2xl font-semibold pt-4">Digital Products</h2>
        <p>All products available for purchase on our website are digital goods and are delivered electronically to your provided email address immediately after a successful payment.</p>

        <h2 className="text-2xl font-semibold pt-4">Refund Policy</h2>
        <p>Due to the immediate and irreversible nature of digital product delivery, all sales are final. We do not offer refunds or exchanges once a payment is completed and the file has been delivered. We encourage you to be certain about your purchase before completing the transaction.</p>

        <h2 className="text-2xl font-semibold pt-4">Cancellation</h2>
        <p>If you have initiated a payment but have not completed it, you can simply cancel the process or close the payment window. No charges will be made, and no file will be delivered. Your request information may be stored with a "pending" status for internal analytics.</p>

        If you have any questions about our refund policy, please contact us at abhi.digitostore@gmail.com.
        
      </div>
    </div>
  );
}
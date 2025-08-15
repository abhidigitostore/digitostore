// web/app/contact-us/page.tsx

export default function ContactUsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
      <div className="space-y-4">
        <p>
          If you have any questions or concerns, please feel free to reach out to us.
        </p>
        <h2 className="text-2xl font-semibold pt-4">Our Contact Information</h2>
        <ul>
          <li><strong>Email:</strong> [Client's Support Email Address]</li>
          <li><strong>Address:</strong> [Client's Physical Address, if applicable]</li>
        </ul>
      </div>
    </div>
  );
}
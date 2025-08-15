// web/app/terms-and-conditions/page.tsx

export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto p-4 md:p-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
      <div className="space-y-4">
        <p>
          <strong>Last updated: August 15, 2025</strong>
        </p>
        <p>
          Users are completely responsible for how they are using the Data collected from our website.
          Autometa AI is not responsible for any data misuse.
        </p>
        <h2 className="text-2xl font-semibold pt-4">1. Acceptance of Terms</h2>
        <p>
          Use the collected data only for ethical actions.
        </p>
      </div>
    </div>
  );
}
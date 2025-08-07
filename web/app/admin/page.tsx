// web/app/admin/page.tsx
'use client';

import { signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { client } from '@/sanity/client'; // Our read-only client
import SubmissionsTable from '../components/SubmissionsTable';
import Link from 'next/link'; // to add upload page as seperate link

// Define the shape of a single submission
interface Submission {
  _id: string;
  name: string;
  email: string;
  paymentStatus: 'pending' | 'completed';
  requestedDocTitle?: string;
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    // This GROQ query fetches all submissions and also "follows" the
    // reference to the requested document to get its title.
    const query = `*[_type == "submissions"] | order(_createdAt desc) {
      _id,
      name,
      email,
      paymentStatus,
      "requestedDocTitle": requestedDoc->title
    }`;

    async function fetchSubmissions() {
      const data = await client.fetch(query);
      setSubmissions(data);
    }

    fetchSubmissions();
  }, []);

  // Calculate total completed downloads
  const completedCount = submissions.filter(
    (s) => s.paymentStatus === 'completed'
  ).length;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
          {/* Add this button */}
          <Link
            href="/admin/upload"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          >
            Upload New Document
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Stats Card */}
      <div className="mb-8">
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 rounded-md">
          <div className="text-4xl font-bold">{completedCount}</div>
          <div className="text-sm">Total Completed Downloads</div>
        </div>
      </div>

      {/* Submissions Table */}
      <h2 className="text-2xl font-semibold mb-4">Recent Submissions</h2>
      <SubmissionsTable submissions={submissions} />
    </div>
  );
}
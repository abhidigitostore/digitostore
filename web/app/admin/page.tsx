// web/app/admin/page.tsx
'use client';

import { signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { client } from '@/sanity/client';
import SubmissionsTable from '../components/SubmissionsTable';
import Link from 'next/link';

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

  const completedCount = submissions.filter(
    (s) => s.paymentStatus === 'completed'
  ).length;

  return (
    // Change padding to be responsive
    <div className="p-4 md:p-8">
      {/* Change flex direction to be responsive */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-4">
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
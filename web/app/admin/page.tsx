// web/app/admin/page.tsx
'use client';

import { signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
// 1. Import the main createClient function from Sanity
import { createClient } from '@sanity/client';
import SubmissionsTable from '../components/SubmissionsTable';
import Link from 'next/link';
import { toast, Toaster } from 'react-hot-toast';

// 2. Create a new, authenticated client for admin-only data fetching
const adminClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!, // Use the admin token
  useCdn: false, // Bypass the cache to get fresh data
  apiVersion: '2024-07-30',
});

// Define the shape of a single submission
interface Submission {
  _id: string;
  name: string;
  email: string;
  paymentStatus: 'pending' | 'completed';
  requestedDocs?: { title: string }[]; // Changed to an array of objects
}

// Define a new type for our documents
interface Document {
  _id: string;
  title: string;
}

export default function AdminPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  const fetchAllData = async () => {
    // SUBMISSIONS QUERY
    const submissionsQuery = `*[_type == "submissions"] | order(_createdAt desc) {
      _id,
      name,
      email,
      paymentStatus,
      "requestedDocs": requestedDocs[]->{title}
    }`;
    const documentsQuery = `*[_type == "documents"] | order(_createdAt desc) { _id, title }`;
    
    const [submissionsData, documentsData] = await Promise.all([
      adminClient.fetch(submissionsQuery),
      adminClient.fetch(documentsQuery),
    ]);
    
    setSubmissions(submissionsData);
    setDocuments(documentsData);
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleDelete = async (documentId: string) => {
    if (window.confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
      try {
        const response = await fetch('/api/delete-document', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ documentId }),
        });

        if (!response.ok) throw new Error('Failed to delete');

        toast.success('Document deleted successfully!');
        // Refresh the list of documents and submissions
        fetchAllData();
      } catch (error) {
        toast.error('Failed to delete document.');
        console.error(error);
      }
    }
  };

  const completedCount = submissions.filter(s => s.paymentStatus === 'completed').length;

  return (
    <div className="p-4 md:p-8">
      <Toaster />
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <Link
            href="/admin/upload"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 text-center"
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

      {/* NEW SECTION: Manage Documents */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Manage Documents</h2>
        <div className="bg-white p-4 rounded-lg border space-y-3">
          {documents.length > 0 ? (
            documents.map((doc) => (
              <div key={doc._id} className="flex justify-between items-center p-2 border-b last:border-b-0">
                <span>{doc.title}</span>
                <button
                  onClick={() => handleDelete(doc._id)}
                  className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p>No documents found.</p>
          )}
        </div>
      </div>

      {/* Submissions Table */}
      <h2 className="text-2xl font-semibold mb-4">Recent Submissions</h2>
      <SubmissionsTable submissions={submissions} />
    </div>
  );
}
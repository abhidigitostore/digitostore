// web/app/components/SubmissionsTable.tsx
'use client';

// Define the shape of a single submission
interface Submission {
  _id: string;
  name: string;
  email: string;
  paymentStatus: 'pending' | 'completed';
  requestedDocTitle?: string; // This is the document title we'll fetch
}

interface SubmissionsTableProps {
  submissions: Submission[];
}

export default function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  if (submissions.length === 0) {
    return <p>No submissions found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 border-b text-left">Name</th>
            <th className="py-2 px-4 border-b text-left">Email</th>
            <th className="py-2 px-4 border-b text-left">Requested Document</th>
            <th className="py-2 px-4 border-b text-left">Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission._id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{submission.name}</td>
              <td className="py-2 px-4 border-b">{submission.email}</td>
              <td className="py-2 px-4 border-b">
                {submission.requestedDocTitle || 'N/A'}
              </td>
              <td className="py-2 px-4 border-b">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    submission.paymentStatus === 'completed'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-yellow-200 text-yellow-800'
                  }`}
                >
                  {submission.paymentStatus}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
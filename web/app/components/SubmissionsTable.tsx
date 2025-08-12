// web/app/components/SubmissionsTable.tsx
'use client';

interface Submission {
  _id: string;
  name: string;
  email: string;
  paymentStatus: 'pending' | 'completed';
  requestedDocTitle?: string;
}

interface SubmissionsTableProps {
  submissions: Submission[];
}

export default function SubmissionsTable({ submissions }: SubmissionsTableProps) {
  if (submissions.length === 0) {
    return <p>No submissions found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-50">
          <tr>
            {/* Add whitespace-nowrap to headers */}
            <th className="py-2 px-4 border-b text-left whitespace-nowrap">Name</th>
            <th className="py-2 px-4 border-b text-left whitespace-nowrap">Email</th>
            <th className="py-2 px-4 border-b text-left whitespace-nowrap">Requested Document</th>
            <th className="py-2 px-4 border-b text-left whitespace-nowrap">Payment Status</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission._id} className="hover:bg-gray-50">
              {/* Add whitespace-nowrap to data cells */}
              <td className="py-2 px-4 border-b whitespace-nowrap">{submission.name}</td>
              <td className="py-2 px-4 border-b whitespace-nowrap">{submission.email}</td>
              <td className="py-2 px-4 border-b whitespace-nowrap">
                {submission.requestedDocTitle || 'N/A'}
              </td>
              <td className="py-2 px-4 border-b whitespace-nowrap">
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
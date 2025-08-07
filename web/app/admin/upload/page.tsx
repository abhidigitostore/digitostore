// web/app/admin/upload/page.tsx
import UploadForm from '@/app/components/UploadForm';
import Link from 'next/link';

export default function UploadPage() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Upload New Document</h1>
        <Link href="/admin" className="text-blue-600 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>
      {/* Add this wrapper div to center the form */}
      <div className="flex justify-center">
        <UploadForm />
      </div>
    </div>
  );
}
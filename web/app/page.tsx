// web/app/page.tsx
'use client'; // This is now a client component

import { useState, useEffect } from 'react';
import { client } from '@/sanity/client';
import RequestForm from './components/RequestForm'; // Import the form

// Define the shape of our document data
interface Document {
  _id: string;
  title: string;
  description: string;
  price : number;
}

const query = `*[_type == "documents"]{
  _id,
  title,
  description,
  price
}`;

export default function Home() {
  // State for storing documents
  const [documents, setDocuments] = useState<Document[]>([]);
  // State to track the selected document for the form
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  // Fetch data on the client side
  useEffect(() => {
    async function fetchDocuments() {
      const docs = await client.fetch(query);
      setDocuments(docs);
    }
    fetchDocuments();
  }, []);

  return (
    <main className="p-4 md:p-8">
      <h1 className="text-4xl font-bold mb-6">Available Documents</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          // Make the card a button to trigger the modal
          <button
            key={doc._id}
            onClick={() => {setSelectedDoc(doc);}}
            className="border p-4 rounded-lg shadow-md text-left hover:ring-2 hover:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <h2 className="text-2xl font-semibold mb-2">{doc.title}</h2>
            <p className="text-gray-700">{doc.description}</p>
            <p className="text-grey-700"><b>Price : ₹{doc.price} INR</b></p>
          </button>
        ))}
      </div>

      {/* Conditionally render the form modal */}
      {selectedDoc && (
        <RequestForm
          documentTitle={selectedDoc.title}
          documentId={selectedDoc._id} // <-- ADD THIS LINE
          onClose={() => setSelectedDoc(null)} 
        />
      )}
    </main>
  );
}
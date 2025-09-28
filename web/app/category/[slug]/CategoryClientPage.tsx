// // web/app/category/[slug]/CategoryClientPage.tsx
// 'use client';

// import { useState } from 'react';
// import RequestForm from '@/app/components/RequestForm';
// import Link from 'next/link';
// import Image from 'next/image';

// // Define the shape of our data
// interface Document {
//   _id: string;
//   title: string;
//   description: string;
//   price: number;
//   imageUrl?: string;
// }

// interface CategoryPageProps {
//   title: string;
//   documents: Document[];
// }

// export default function CategoryClientPage({ title, documents }: CategoryPageProps) {
//   const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

//   return (
//     <main className="p-4 md:p-8">
//       <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
//         &larr; Back to all categories
//       </Link>
//       <h1 className="text-3xl md:text-4xl font-bold mb-8">
//         Category: {title}
//       </h1>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//         {/* FIX: Loop over 'documents' directly, not 'category.documents' */}
//         {documents.map((doc) => (
//           <button
//             key={doc._id}
//             onClick={() => setSelectedDoc(doc)}
//             className="border rounded-lg shadow-md text-left hover:ring-2 hover:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden"
//           >
//             {doc.imageUrl && (
//               <div className="relative h-40 w-full">
//                 <Image
//                   src={doc.imageUrl}
//                   alt={doc.title}
//                   fill // Use the modern 'fill' prop
//                   className="object-cover"
//                   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" // Use className for object-fit
//                 />
//               </div>
//             )}
//             <div className="p-4">
//               <h2 className="text-xl font-semibold mb-2">{doc.title}</h2>
//               <p className="text-gray-600 text-sm mb-4">{doc.description}</p>
//               <p className="font-semibold text-lg">₹{doc.price} INR</p>
//             </div>
//           </button>
//         ))}
//       </div>

//       {selectedDoc && (
//         <RequestForm
//           documentTitle={selectedDoc.title}
//           documentId={selectedDoc._id}
//           onClose={() => setSelectedDoc(null)}
//         />
//       )}
//     </main>
//   );
// }

// web/app/category/[slug]/CategoryClientPage.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import AddToCartButton from '@/app/components/AddToCartButton'; // ADDED: Import the AddToCartButton

// Define the shape of our data
interface Document {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
}

interface CategoryPageProps {
  title: string;
  documents: Document[];
}

export default function CategoryClientPage({ title, documents }: CategoryPageProps) {
  return (
    <main className="p-4 md:p-8">
      <Link href="/" className="text-blue-600 hover:underline mb-6 inline-block">
        &larr; Back to all categories
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold mb-8">
        Category: {title}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => (
          // CHANGED: The card is now a <div>, not a <button>, and has no onClick
          <div
            key={doc._id}
            className="border rounded-lg shadow-md overflow-hidden group flex flex-col"
          >
            {doc.imageUrl && (
              <div className="relative h-40 w-full">
                <Image
                  src={doc.imageUrl}
                  alt={doc.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-xl font-semibold mb-2">{doc.title}</h2>
              <p className="text-gray-600 text-sm mb-4 flex-grow">{doc.description}</p>
              <p className="font-semibold text-lg">₹{doc.price} INR</p>
              
              {/* ADDED: The new Add to Cart button */}
              <AddToCartButton doc={doc} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
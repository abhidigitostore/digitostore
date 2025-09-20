// web/app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { client } from '@/sanity/client';
import RequestForm from './components/RequestForm';
import Link from 'next/link';
import Image from 'next/image'; 
interface Document {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl?: string;
}

interface Category {
  _id: string;
  title: string;
  slug: string;
  documentCount: number;
  documents: Document[];
}

// 2. Create the new, more powerful GROQ query
const query = `*[_type == "category"]{
  _id,
  title,
  "slug": slug.current,
  "documentCount": count(*[_type == "documents" && references(^._id)]),
  "documents": *[_type == "documents" && references(^._id)] | order(_createdAt desc) [0...3]{
    _id,
    title,
    description,
    price,
    "imageUrl": mainImage.asset->url
  }
}`;

export default function Home() {
  // 3. State will now hold categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  useEffect(() => {
    async function fetchData() {
      const data = await client.fetch(query);
      setCategories(data);
    }
    fetchData();
  }, []);

  return (
    <main className="p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Available Documents</h1>
      
      {/* 4. Update the render logic with nested loops */}
      <div className="space-y-12">
        {categories.map((category) => (
          <section key={category._id}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">{category.documentCount>0 && category.title}</h2>
              {/* 5. Conditionally show the "View all" link */}
              {category.documentCount > 3 && (
                <Link 
                  href={`/category/${category.slug}`}
                  className="text-blue-600 hover:underline"
                >
                  View all
                </Link>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.documents.map((doc, index) => (
                <button
                  key={doc._id}
                  onClick={() => setSelectedDoc(doc)}
                  className="border rounded-lg shadow-md text-left hover:ring-2 hover:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-hidden group"
                >
                  {doc.imageUrl && (
                    <div className="relative h-40 w-full">
                      <Image
                        src={doc.imageUrl}
                        alt={doc.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        // ADD THESE TWO PROPS
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index < 3} // Prioritize the first 3 images
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{doc.title}</h2>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{doc.description}</p>
                    <p className="font-semibold text-lg">₹{doc.price} INR</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Conditionally render the form modal (this logic is unchanged) */}
      {selectedDoc && (
        <RequestForm
          documentTitle={selectedDoc.title}
          documentId={selectedDoc._id}
          onClose={() => setSelectedDoc(null)} 
        />
      )}
    </main>
  );
}
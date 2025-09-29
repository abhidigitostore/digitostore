// web/app/admin/categories/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@sanity/client';
import Link from 'next/link';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';

const adminClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
  apiVersion: '2024-07-30',
});

interface Category {
  _id: string;
  title: string;
}

type Inputs = {
  title: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm<Inputs>();

  const fetchCategories = async () => {
    const data = await adminClient.fetch(`*[_type == "category"] | order(title asc)`);
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    try {
      const response = await fetch('/api/add-category', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: data.title }),
      });

      if (!response.ok) throw new Error('Failed to create category');

      toast.success('Category created successfully!');
      reset();
      fetchCategories(); // Refresh the list
    } catch (error) {
      toast.error('Something went wrong.');
      console.error(error);
    }
  };
    
  const handleDelete = async (categoryId: string) => {
    if (window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      try {
        const response = await fetch('/api/delete-category', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ categoryId }),
        });

        if (!response.ok) throw new Error('Failed to delete');

        toast.success('Category deleted successfully!');
        // Refresh the list of documents and submissions
        fetchCategories();
      } catch (error) {
        toast.error('Failed to delete category.');
        console.error(error);
      }
    }
  };

  return (
    <div className="p-4 md:p-8">
      <Toaster />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Manage Categories</h1>
        <Link href="/admin" className="text-blue-600 hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>

      {/* Form to add a new category */}
      <div className="mb-12">
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-md p-6 border rounded-lg bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Add New Category</h2>
          <div className="flex items-end gap-4">
            <div className="flex-grow">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Category Title</label>
              <input
                id="title"
                type="text"
                {...register('title', { required: true })}
                className="w-full p-2 border rounded mt-1"
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>

      {/* List of existing categories */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Existing Categories</h2>
        <div className="bg-white p-4 rounded-lg border space-y-3">
          {categories.length > 0 ? (
            categories.map((cat) => (
              <div key={cat._id} className="flex justify-between items-center p-2 border-b last:border-b-0">
                <span>{cat.title}</span>
                <button
                  onClick={() => handleDelete(cat._id)}
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
    </div>
  );
}
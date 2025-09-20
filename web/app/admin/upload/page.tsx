// web/app/components/UploadForm.tsx
'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';
// 1. Import hooks and the Sanity client
import { useState, useEffect } from 'react';
import { client } from '@/sanity/client';

// 2. Define the shape of a Category
interface Category {
  _id: string;
  title: string;
}

type Inputs = {
  title: string;
  description: string;
  price: number;
  dataFile: FileList;
  categoryId: string;
  mainImage: FileList;
};

export default function UploadForm() {
  // 4. Add state to store the fetched categories
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<Inputs>();

  // Fetch categories when the component loads
  useEffect(() => {
    async function fetchCategories() {
      const cats = await client.fetch(`*[_type == "category"] | order(title asc)`);
      setCategories(cats);
    }
    fetchCategories();
  }, []);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', String(data.price));
    formData.append('dataFile', data.dataFile[0]);
    formData.append('categoryId', data.categoryId);
    formData.append('mainImage', data.mainImage[0]);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      toast.success('File uploaded successfully!');
      reset();
    } catch (error) {
      toast.error('Something went wrong.');
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl p-8 border rounded-lg shadow-md bg-white"
    >
      <Toaster />
      <div className="mb-4">
        <label className="block mb-1">Title</label>
        <input
          type="text"
          {...register('title', { required: true })}
          className="w-full p-2 border rounded"
        />
      </div>

      {/* ADD THE CATEGORY DROPDOWN */}
      <div className="mb-4">
        <label className="block mb-1">Category</label>
        <select
          {...register('categoryId', { required: true })}
          className="w-full p-2 border rounded bg-white"
        >
          <option value="">Select a category...</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.title}
            </option>
          ))}
        </select>
      </div>
      
      <div className="mb-4">
        <label className="block mb-1">Description</label>
        <textarea
          {...register('description')}
          className="w-full p-2 border rounded"
          rows={4}
        ></textarea>
      </div>
      <div className="mb-4">
        <label className="block mb-1">Price (₹)</label>
        <input
          type="number"
          step="0.01"
          {...register('price', { required: true, valueAsNumber: true })}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-1">Data File</label>
        <input
          type="file"
          {...register('dataFile', { required: true })}
          className="w-full p-2 border rounded"
        />
      </div>
      <div className="mb-6">
        <label className="block mb-1">Cover Image</label>
        <input
          type="file"
          accept="image/*" // Only accept image files
          {...register('mainImage', { required: true })}
          className="w-full p-2 border rounded"
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isSubmitting ? 'Uploading...' : 'Upload Document'}
      </button>
    </form>
  );
}
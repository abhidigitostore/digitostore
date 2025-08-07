// web/app/components/UploadForm.tsx
'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';

type Inputs = {
  title: string;
  description: string;
  price: number;
  dataFile: FileList;
};

export default function UploadForm() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('price', String(data.price));
    formData.append('dataFile', data.dataFile[0]);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      toast.success('File uploaded successfully!');
      reset(); // Clear the form fields
    } catch (error) {
      toast.error('Something went wrong.');
      console.error(error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl p-8 border rounded-lg shadow-md bg-white align-middle"
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
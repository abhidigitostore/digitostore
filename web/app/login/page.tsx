// web/app/login/page.tsx
'use client';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { toast, Toaster } from 'react-hot-toast';

// Define the shape of our form inputs
type Inputs = {
  username: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const result = await signIn('credentials', {
      redirect: false, // Do not redirect automatically
      username: data.username,
      password: data.password,
    });

    if (result?.error) {
      toast.error('Invalid username or password');
    } else {
      toast.success('Login successful!');
      router.push('/admin'); // Redirect to admin page on success
    }
  };

  return (
    <div className="flex items-center justify-center mt-20">
      <Toaster />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-8 border rounded-lg shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
        <div className="mb-4">
          <label className="block mb-1">Username</label>
          <input
            type="text"
            {...register('username', { required: true })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1">Password</label>
          <input
            type="password"
            {...register('password', { required: true })}
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Login
        </button>
      </form>
    </div>
  );
}
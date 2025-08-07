// web/app/components/RequestForm.tsx
'use client';

import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast';

// This is the corrected way to add the Razorpay property to the window object
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

interface FormInputs {
  name: string;
  email: string;
  purpose: 'personal' | 'business';
  consent: boolean;
}

interface RequestFormProps {
  documentTitle: string;
  documentId: string;
  onClose: () => void;
}

export default function RequestForm({ documentTitle, documentId, onClose }: RequestFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FormInputs>({
    defaultValues: {
      consent: false,
    },
  });

  const onSubmit: SubmitHandler<FormInputs> = async (formData) => {
    console.log('Faking payment submission...');

    const fakeRazorpayResponse = {
      razorpay_payment_id: `fake_pay_${Date.now()}`,
      razorpay_order_id: `fake_order_${Date.now()}`,
      razorpay_signature: 'fake_signature',
    };

    try {
      const verificationResponse = await fetch('/api/payment-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...fakeRazorpayResponse,
          formData,
          documentId,
        }),
      });

      const result = await verificationResponse.json();

      if (result.success) {
        toast.success('Payment verified successfully! (Mocked)');
        window.location.href = '/payment-success';
      } else {
        throw new Error(result.error || 'Mocked payment verification failed.');
      }
    } catch (error) {
      console.error('Verification Error:', error);
      toast.error(String(error));
      window.location.href = '/payment-failure';
    }
  };

  return (
    // ... the rest of your JSX form is unchanged
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <Toaster />
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-2">Request Access</h2>
        <p className="mb-6">
          You are requesting the document: <span className="font-semibold">{documentTitle}</span>
        </p>
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Name Field */}
          <div className="mb-4">
            <label htmlFor="name" className="block mb-1 font-medium">Name</label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Name is required' })}
              className="w-full p-2 border rounded"
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-1 font-medium">Email</label>
            <input
              id="email"
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full p-2 border rounded"
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
          </div>

          {/* Purpose Field */}
          <div className="mb-4">
            <label htmlFor="purpose" className="block mb-1 font-medium">Purpose</label>
            <select
              id="purpose"
              {...register('purpose', { required: 'Purpose is required' })}
              className="w-full p-2 border rounded bg-white"
              disabled={isSubmitting}
            >
              <option value="personal">Personal Use</option>
              <option value="business">Business Use</option>
            </select>
          </div>

          {/* Consent Checkbox */}
          <div className="mb-6">
            <div className="flex items-center">
              <Controller
                name="consent"
                control={control}
                rules={{ required: 'You must agree to the terms' }}
                render={({ field }) => (
                  <input
                    id="consent"
                    type="checkbox"
                    onChange={field.onChange}
                    checked={field.value}
                    ref={field.ref}
                    className="h-4 w-4"
                    disabled={isSubmitting}
                  />
                )}
              />
              <label htmlFor="consent" className="ml-2">I will not misuse the data.</label>
            </div>
            {errors.consent && <p className="text-red-500 text-sm mt-1">{errors.consent.message}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded" disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
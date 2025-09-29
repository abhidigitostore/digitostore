// web/app/components/RequestForm.tsx
'use client';
import { useState } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { Toaster, toast } from 'react-hot-toast';
import { useCart } from '@/lib/context/CartContext';
import { Loader2 } from 'lucide-react';

// ADDED cart item to NEW - This interface should be in a shared types file
interface CartItem {
  _id: string;
  title: string;
  price: number;
  imageUrl?: string;
}

// This is the corrected way to add the Razorpay property to the window object
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}
interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
interface FormInputs {
  name: string;
  email: string;
  purpose: 'personal' | 'business';
  consent: boolean;
}

// --- CHANGED: Updated props for the form to accept multiple cart items ---
interface RequestFormProps {
  totalAmount: number;
  cartItems: CartItem[];
  onClose: () => void;
}

// --- CHANGED: Destructure new props ---
export default function RequestForm({ totalAmount, cartItems, onClose }: RequestFormProps) {
    // --- ADDED: Get the dispatch function from our cart context ---
    const { dispatch } = useCart();
    // --- ADDED: State to manage the post-payment loading/verification screen ---
    const [isVerifying, setIsVerifying] = useState(false);

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
  try {
    // --- CHANGED: Send cartItems instead of a single documentId ---
    const orderResponse = await fetch('/api/initiate-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cartItems: cartItems, formData: formData }),
    });

    const orderResult = await orderResponse.json();
    if (!orderResponse.ok) throw new Error(orderResult.error);

    const options = {
      key: orderResult.keyId,
      amount: orderResult.amount, // This will come from the backend based on totalAmount
      currency: 'INR',
      name: 'AutoMeta AI',
      // --- CHANGED: Updated description ---
      description: `Payment for ${cartItems.length} items`,
      order_id: orderResult.orderId,
      handler: async function (response: RazorpayResponse) {
        try {
          setIsVerifying(true);
          // --- CHANGED: Send cartItems for verification ---
          const verificationResponse = await fetch('/api/payment-verification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...response, formData, cartItems }),
          });
          const verificationResult = await verificationResponse.json();
          if (verificationResult.success) {
            toast.success('Payment verified successfully!');
            dispatch({ type: 'CLEAR_CART' }); // clearing the cart
            window.location.href = '/payment-success';
          } else {
            throw new Error(verificationResult.error);
          }
        } catch (error) {
          toast.error(String(error));
          window.location.href = '/payment-failure';
        }
      },
      prefill: { name: formData.name, email: formData.email },
      theme: { color: '#3399cc' },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error('Submission Error:', error);
    toast.error(String(error));
  }
};

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Toaster />
      <div className="bg-white rounded-lg p-8 w-full max-w-md">
        {isVerifying ? (
          <div className="flex flex-col items-center justify-center text-center h-48">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Verifying Payment...</h2>
            <p className="text-gray-600">Please do not close this window.</p>
          </div>
        ) : (
        <>
        <h2 className="text-2xl font-bold mb-2">Complete Your Purchase</h2>
        {/* --- CHANGED: Updated summary text --- */}
        <p className="mb-6">
          You are purchasing <span className="font-semibold">{cartItems.length} items</span> for a total of <span className="font-semibold">₹{totalAmount.toLocaleString('en-IN')}</span>.
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
        </>
        )}
      </div>
    </div>
  );
}
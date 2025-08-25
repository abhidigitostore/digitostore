// web/app/api/initiate-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { createClient } from '@sanity/client';
import { randomBytes } from 'crypto';

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
  apiVersion: '2024-07-30',
});


const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: NextRequest) {
  try {
    const { formData, documentId } = await request.json();
    if (!documentId || !formData) throw new Error('Missing required data');

    const query = `*[_id == $documentId][0]{price}`;
    const doc = await writeClient.fetch(query, { documentId });
    if (!doc || typeof doc.price !== 'number') throw new Error('Document not found or price is invalid');

    const amountInPaise = Math.round(doc.price * 100);

    // A more robust, unique receipt ID
    const uniqueId = randomBytes(6).toString('hex');
    const receiptId = `receipt_${Date.now()}_${uniqueId}`;

    // 1. Create the Razorpay Order first
    const orderOptions = {
      amount: amountInPaise,
      currency: 'INR',
      receipt: receiptId,
    };
    const order = await razorpay.orders.create(orderOptions);

    // 2. Now, save the submission to Sanity with the Order ID
    await writeClient.create({
      _type: 'submissions',
      name: formData.name,
      email: formData.email,
      purpose: formData.purpose,
      consent: formData.consent,
      paymentStatus: 'pending',
      orderId: order.id, // Save the Razorpay Order ID
      requestedDoc: { _type: 'reference', _ref: documentId, _weak: true },
    });

    // 3. Return order details to the frontend
    return NextResponse.json({ 
      orderId: order.id, 
      amount: order.amount,
      keyId: process.env.RAZORPAY_KEY_ID 
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
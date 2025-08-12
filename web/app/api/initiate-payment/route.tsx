// web/app/api/initiate-payment/route.ts

// import { NextRequest, NextResponse } from 'next/server';
// import { createClient } from '@sanity/client';
// import crypto from 'crypto';

// const writeClient = createClient({
//   projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
//   dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
//   token: process.env.SANITY_API_TOKEN!,
//   useCdn: false,
//   apiVersion: '2024-07-30',
// });

// export async function POST(request: NextRequest) {
//   // ✅ SENIOR DEV FIX: Check for critical environment variables first.
//   const appBaseUrl = process.env.NEXT_PUBLIC_BASE_URL;
//   if (!appBaseUrl) {
//     console.error("CRITICAL CONFIGURATION ERROR: NEXT_PUBLIC_BASE_URL is not set in the environment.");
//     // Fail immediately with a clear error message.
//     return NextResponse.json(
//       { success: false, error: "Server configuration is incomplete. Please contact support." },
//       { status: 500 }
//     );
//   }

//   try {
//     const { formData, documentId } = await request.json();

//     const amount = 1000; // ₹10 in paise
//     const merchantTransactionId = `TXN_${Date.now()}`;

//     // 1. Create a "pending" submission in Sanity
//     await writeClient.create({
//       _type: 'submissions',
//       name: formData.name,
//       email: formData.email,
//       purpose: formData.purpose,
//       consent: formData.consent,
//       paymentStatus: 'pending',
//       merchantTransactionId: merchantTransactionId,
//       requestedDoc: {
//         _type: 'reference',
//         _ref: documentId,
//       },
//     });

//     // 2. Prepare payment data for PhonePe
//     const paymentData = {
//       merchantId: process.env.PHONEPE_MERCHANT_ID,
//       merchantTransactionId: merchantTransactionId,
//       merchantUserId: `MUID_${Date.now()}`,
//       amount: amount,
//       redirectUrl: `${appBaseUrl}/api/payment-status`, // Now using the validated appBaseUrl
//       redirectMode: 'POST',
//       callbackUrl: `${appBaseUrl}/api/payment-status`, // Now using the validated appBaseUrl
//       mobileNumber: '9999999999',
//       paymentInstrument: { type: 'PAY_PAGE' },
//     };

//     const payload = JSON.stringify(paymentData);
//     const payloadBase64 = Buffer.from(payload).toString('base64');
//     const saltKey = process.env.PHONEPE_SALT_KEY!;
//     const saltIndex = process.env.PHONEPE_SALT_INDEX!;
//     const stringToHash = `${payloadBase64}/pg/v1/pay${saltKey}`;
//     const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
//     const xVerify = `${sha256}###${saltIndex}`;

//     console.log("--- INITIATING PHONEPE PAYMENT (URL: " + appBaseUrl + ") ---");

//     // 3. Call PhonePe API
//     const phonepeResponse = await fetch(`${process.env.PHONEPE_HOST_URL}/pg/v1/pay`, {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json', 'X-VERIFY': xVerify },
//       body: JSON.stringify({ request: payloadBase64 }),
//     });

//     const responseData = await phonepeResponse.json();

//     if (responseData.success) {
//       const paymentUrl = responseData.data.instrumentResponse.redirectInfo.url;
//       return NextResponse.json({ success: true, paymentUrl });
//     } else {
//       console.error("PhonePe API Error:", responseData.message);
//       throw new Error(responseData.message || 'PhonePe API returned an error');
//     }
//   } catch (error) {
//     console.error('Error initiating payment:', error);
//     return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
//   }
// }

import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST() {
  try {
    const amount = 1000; // ₹10 in paise
    const options = {
      amount: amount,
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({ 
      orderId: order.id, 
      amount: order.amount,
      keyId: process.env.RAZORPAY_KEY_ID 
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
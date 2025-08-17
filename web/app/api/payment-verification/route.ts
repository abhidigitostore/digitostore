// web/app/api/payment-verification/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@sanity/client';
import nodemailer from 'nodemailer';

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN!,
  useCdn: false,
  apiVersion: '2025-08-10',
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_EMAIL!,
    pass: process.env.GMAIL_APP_PASSWORD!,
  },
});

// export async function POST(request: NextRequest) {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();
//     const key_secret = process.env.RAZORPAY_KEY_SECRET!;

//     const hmac = crypto.createHmac('sha256', key_secret);
//     hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
//     const generated_signature = hmac.digest('hex');

//     if (generated_signature === razorpay_signature) {
//       // 1. Find the pending submission using the Order ID
//       const subQuery = `*[_type == "submissions" && orderId == $orderId][0]`;
//       const submission = await writeClient.fetch(subQuery, { orderId: razorpay_order_id });
      
//       if (!submission) throw new Error('Submission not found');
      
//       // 2. Update its status to "completed"
//       await writeClient.patch(submission._id).set({ paymentStatus: 'completed' }).commit();

//       const docQuery = `*[_id == $docId][0]{"fileUrl": dataFile.asset->url}`;
//       const doc = await writeClient.fetch(docQuery, { docId: submission.requestedDoc._ref });
//       if (!doc || !doc.fileUrl) throw new Error('File not found');
      
//       // 3. Send the email
//       await transporter.sendMail({
//           from: `"Your Brand Name" <${process.env.GMAIL_EMAIL}>`,
//           to: submission.email,
//           subject: 'Your document is ready for download!',
//           html: `<h1>Thank you!</h1><p>Download your file here: <a href="${doc.fileUrl}?dl=">Download Now</a></p>`,
//       });
//       return NextResponse.json({ success: true });
//     } else {
//       return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
//     }
//   } catch (error) {
//     console.error('Error verifying payment:', error);
//     return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
//   }
// }
export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, formData, documentId } = await request.json();
    console.log("VERIFICATION API: Received data from frontend.", { razorpay_order_id, formData });
    
    const key_secret = process.env.RAZORPAY_KEY_SECRET!;
    const hmac = crypto.createHmac('sha256', key_secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      console.log("VERIFICATION API: Signature is authentic. Proceeding with fulfillment.");
      
      const subQuery = `*[_type == "submissions" && orderId == $orderId][0]`;
      const submission = await writeClient.fetch(subQuery, { orderId: razorpay_order_id });
      if (!submission) throw new Error(`Submission not found for Order ID: ${razorpay_order_id}`);
      console.log("VERIFICATION API: Found pending submission in Sanity.");

      await writeClient.patch(submission._id).set({ paymentStatus: 'completed' }).commit();
      console.log("VERIFICATION API: Updated submission to 'completed'.");

      const docQuery = `*[_id == $docId][0]{"fileUrl": dataFile.asset->url}`;
      const doc = await writeClient.fetch(docQuery, { docId: submission.requestedDoc._ref });
      if (!doc || !doc.fileUrl) throw new Error('File not found in Sanity');
      console.log("VERIFICATION API: Fetched file URL. Preparing to send email.");

      await transporter.sendMail({
          from: `"Your Brand Name" <${process.env.GMAIL_EMAIL}>`,
          to: submission.email,
          subject: 'Your document is ready for download!',
          html: `<h1>Thank you!</h1><p>Download your file here: <a href="${doc.fileUrl}?dl=">Download Now</a></p>`,
      });
      console.log("VERIFICATION API: Email sent successfully.");
      return NextResponse.json({ success: true });
    } else {
      console.error("VERIFICATION API: Invalid signature.");
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }
  } catch (error) {
    console.error("VERIFICATION API: An error occurred.", error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
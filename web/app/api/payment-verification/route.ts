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

export async function POST(request: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, formData, documentId } = await request.json();
    const key_secret = process.env.RAZORPAY_KEY_SECRET!;

    const hmac = crypto.createHmac('sha256', key_secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      // Signature is authentic, proceed with fulfillment
      const query = `*[_id == $documentId][0]{"fileUrl": dataFile.asset->url}`;
      const doc = await writeClient.fetch(query, { documentId });
      if (!doc || !doc.fileUrl) throw new Error('File not found in Sanity');

      await writeClient.create({
        _type: 'submissions',
        name: formData.name,
        email: formData.email,
        purpose: formData.purpose,
        consent: formData.consent,
        paymentStatus: 'completed',
        requestedDoc: { _type: 'reference', _ref: documentId },
      });

      await transporter.sendMail({
        from: `"Your Brand Name" <${process.env.GMAIL_EMAIL}>`,
        to: formData.email,
        subject: 'Your document is ready for download!',
        html: `<h1>Thank you!</h1><p>Download your file here: <a href="${doc.fileUrl}?dl=">Download Now</a></p>`,
      });
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
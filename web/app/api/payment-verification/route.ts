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
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await request.json();
    
    const key_secret = process.env.RAZORPAY_KEY_SECRET!;
    const hmac = crypto.createHmac('sha256', key_secret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest('hex');

    if (generated_signature === razorpay_signature) {
      console.log("VERIFICATION API: Signature is authentic.");
      
      const subQuery = `*[_type == "submissions" && orderId == $orderId][0]{..., "docRefs": requestedDocs[]._ref}`;
      const submission = await writeClient.fetch(subQuery, { orderId: razorpay_order_id });
      if (!submission) throw new Error(`Submission not found for Order ID: ${razorpay_order_id}`);
      
      // --- CHANGED: Update submission status ---
      await writeClient.patch(submission._id).set({ paymentStatus: 'completed' }).commit();
      console.log("VERIFICATION API: Updated submission to 'completed'.");

      // --- CHANGED: Fetch all documents based on the references in the submission ---
      const docQuery = `*[_id in $docIds]{title, "fileUrl": dataFile.asset->url}`;
      const documents = await writeClient.fetch(docQuery, { docIds: submission.docRefs });
      if (!documents || documents.length === 0) throw new Error('Files not found in Sanity');
      
      // --- CHANGED: Build an HTML list of download links ---
      const downloadLinksHtml = documents.map((doc: { title: string; fileUrl: string }) => 
        `<li><strong>${doc.title}</strong>: <a href="${doc.fileUrl}?dl=">Download Now</a></li>`
      ).join('');

      // --- CHANGED: Send a single email with all the links ---
      await transporter.sendMail({
        from: `"AutoMeta AI" <${process.env.GMAIL_EMAIL}>`,
        to: submission.email,
        subject: 'Your purchased files are ready for download!',
        html: `
          <h1>Thank you for your purchase!</h1>
          <p>You can download your files below:</p>
          <ul>
            ${downloadLinksHtml}
          </ul>
        `,
      });
      console.log("VERIFICATION API: Email with all file links sent successfully.");
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
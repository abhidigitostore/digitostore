// // web/app/api/payment-verification/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import crypto from 'crypto';

// export async function POST(request: NextRequest) {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
//       await request.json();

//     const key_secret = process.env.RAZORPAY_KEY_SECRET!;

//     // This is the core logic for verifying the signature
//     const hmac = crypto.createHmac('sha256', key_secret);
//     hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
//     const generated_signature = hmac.digest('hex');

//     if (generated_signature === razorpay_signature) {
//       // Signature is authentic
//       // On the next step, we'll update Sanity and send the email here.
//       return NextResponse.json({ success: true });
//     } else {
//       // Signature is not authentic
//       return NextResponse.json(
//         { success: false, error: 'Invalid signature' },
//         { status: 400 }
//       );
//     }
//   } catch (error) {
//     console.error('Error verifying payment:', error);
//     return NextResponse.json(
//       { success: false, error: 'Internal Server Error' },
//       { status: 500 }
//     );
//   }
// }

// fake signature
// web/app/api/payment-verification/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@sanity/client';
import nodemailer from 'nodemailer';

// Sanity client for write operations
const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-07-30',
});

// Nodemailer transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_EMAIL,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
});

export async function POST(request: NextRequest) {
  // We are still faking the signature check
  const isSignatureValid = true; 

  if (isSignatureValid) {
    try {
      const { formData, documentId } = await request.json();
      
      // 1. Fetch the private file URL from Sanity
      const query = `*[_id == $documentId][0]{"fileUrl": dataFile.asset->url}`;
      const doc = await writeClient.fetch(query, { documentId });
      const fileUrl = doc.fileUrl;
      console.log(doc);
      if (!fileUrl) {
        throw new Error('File not found in Sanity');
      }

      // 2. Create the final "completed" submission in Sanity
      await writeClient.create({
        _type: 'submissions',
        name: formData.name,
        email: formData.email,
        purpose: formData.purpose,
        consent: formData.consent,
        paymentStatus: 'completed',
        requestedDoc: {
          _type: 'reference',
          _ref: documentId,
        },
      });

      // 3. Send the email with the download link
      await transporter.sendMail({
          from: `"AutoMeta AI" <${process.env.GMAIL_EMAIL}>`,
          to: formData.email,
          subject: 'Your document is ready for download!',
          html: `<h1>Thank you for your purchase!</h1>
                 <p>You can download your document using the link below:</p>
                 <a href="${fileUrl}?dl=">Download Now</a>
                 <p>This link is valid for a limited time.</p>`,
      });

      return NextResponse.json({ success: true });

    } catch (error) {
      console.error('Error in verification final steps:', error);
      return NextResponse.json({ success: false, error: 'Processing error' }, { status: 500 });
    }

  } else {
    return NextResponse.json(
      { success: false, error: 'Invalid signature' },
      { status: 400 }
    );
  }
}
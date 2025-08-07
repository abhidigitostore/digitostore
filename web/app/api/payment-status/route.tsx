// // web/app/api/payment-status/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import crypto from 'crypto';

// export async function POST(request: NextRequest) {
//   const body = await request.formData();
//   const transactionId = body.get('transactionId') as string;
//   const merchantId = body.get('merchantId') as string;

//   const saltKey = process.env.PHONEPE_SALT_KEY!;
//   const saltIndex = parseInt(process.env.PHONEPE_SALT_INDEX!, 10);
//   const hostUrl = process.env.NEXT_PUBLIC_PHONEPE_HOST_URL!;

//   const stringToHash = `/pg/v1/status/${merchantId}/${transactionId}${saltKey}`;
//   const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
//   const xVerify = `${sha256}###${saltIndex}`;

//   try {
//     const response = await fetch(`${hostUrl}/pg/v1/status/${merchantId}/${transactionId}`, {
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-VERIFY': xVerify,
//         'X-MERCHANT-ID': merchantId,
//       },
//     });

//     const data = await response.json();

//     if (data.success && data.code === 'PAYMENT_SUCCESS') {
//       // IMPORTANT: Here we just redirect the user.
//       // The actual database update and email sending will be handled
//       // by a server-to-server callback in Day 5 for reliability.
//       return NextResponse.redirect('http://localhost:3000/payment-success');
//     } else {
//       return NextResponse.redirect('http://localhost:3000/payment-failure');
//     }
//   } catch (error) {
//     console.error('Error checking payment status:', error);
//     return NextResponse.redirect('http://localhost:3000/payment-failure');
//   }
// }
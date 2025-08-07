// // web/app/api/initiate-payment/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import Razorpay from 'razorpay';

// // Initialize Razorpay client
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID!,
//   key_secret: process.env.RAZORPAY_KEY_SECRET!,
// });

// export async function POST(request: NextRequest) {
//   try {
//     const amount = 1000; // ₹10 in paise

//     const options = {
//       amount: amount,
//       currency: 'INR',
//       receipt: `receipt_${Date.now()}`,
//     };

//     // Create an order in Razorpay
//     const order = await razorpay.orders.create(options);

//     if (!order) {
//       return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
//     }

//     // Return the order details and Key ID to the frontend
//     return NextResponse.json({ 
//       orderId: order.id, 
//       amount: order.amount,
//       keyId: process.env.RAZORPAY_KEY_ID 
//     });

//   } catch (error) {
//     console.error('Error creating Razorpay order:', error);
//     return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
//   }
// }



// fake succesful payment object
// web/app/api/initiate-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // We are temporarily faking the Razorpay API response
  // until we get the real keys.

  console.log('Faking Razorpay order creation...');
  
  // This is a fake but realistic-looking response
  const fakeOrder = {
    orderId: `fake_order_${Date.now()}`,
    amount: 1000, // ₹10 in paise
    keyId: 'FAKE_KEY_ID', // A fake key ID
  };

  return NextResponse.json(fakeOrder);
}
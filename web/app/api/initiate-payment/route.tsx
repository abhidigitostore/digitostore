// fake succesful payment object
// web/app/api/initiate-payment/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(_request: NextRequest) {
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
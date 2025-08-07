// web/app/api/payment-status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  const body = await request.formData();
  const transactionId = body.get('transactionId') as string;
  const merchantId = body.get('merchantId') as string;

  const saltKey = process.env.PHONEPE_SALT_KEY!;
  const saltIndex = parseInt(process.env.PHONEPE_SALT_INDEX!, 10);
  const hostUrl = process.env.NEXT_PUBLIC_PHONEPE_HOST_URL!;

  const stringToHash = `/pg/v1/status/${merchantId}/${transactionId}${saltKey}`;
  const sha256 = crypto.createHash('sha256').update(stringToHash).digest('hex');
  const xVerify = `${sha256}###${saltIndex}`;

  try {
    const response = await fetch(`${hostUrl}/pg/v1/status/${merchantId}/${transactionId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-MERCHANT-ID': merchantId,
      },
    });

    const data = await response.json();

    if (data.success && data.code === 'PAYMENT_SUCCESS') {
      // IMPORTANT: Here we just redirect the user.
      // The actual database update and email sending will be handled
      // by a server-to-server callback in Day 5 for reliability.
      return NextResponse.redirect('http://localhost:3000/payment-success');
    } else {
      return NextResponse.redirect('http://localhost:3000/payment-failure');
    }
  } catch (error) {
    console.error('Error checking payment status:', error);
    return NextResponse.redirect('http://localhost:3000/payment-failure');
  }
}

// [13:49:58.185] Running build in Washington, D.C., USA (East) – iad1
// [13:49:58.185] Build machine configuration: 2 cores, 8 GB
// [13:49:58.206] Cloning github.com/abhidigitostore/digitostore (Branch: main, Commit: 6093176)
// [13:49:58.380] Previous build caches not available
// [13:49:58.478] Cloning completed: 272.000ms
// [13:50:00.968] Running "vercel build"
// [13:50:01.644] Vercel CLI 44.7.2
// [13:50:01.962] Running "install" command: `npm install`...
// [13:50:14.606] 
// [13:50:14.607] added 391 packages, and audited 392 packages in 12s
// [13:50:14.608] 
// [13:50:14.608] 150 packages are looking for funding
// [13:50:14.608]   run `npm fund` for details
// [13:50:14.609] 
// [13:50:14.609] found 0 vulnerabilities
// [13:50:14.692] Detected Next.js version: 15.4.5
// [13:50:14.693] Running "next build"
// [13:50:15.505] Attention: Next.js now collects completely anonymous telemetry regarding usage.
// [13:50:15.506] This information is used to shape Next.js' roadmap and prioritize features.
// [13:50:15.506] You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
// [13:50:15.506] https://nextjs.org/telemetry
// [13:50:15.507] 
// [13:50:15.617]    ▲ Next.js 15.4.5
// [13:50:15.618] 
// [13:50:15.657]    Creating an optimized production build ...
// [13:50:37.454]  ✓ Compiled successfully in 18.0s
// [13:50:37.460]    Linting and checking validity of types ...
// [13:50:41.404] 
// [13:50:41.404] ./app/api/initiate-payment/route.tsx
// [13:50:41.404] 5:28  Warning: '_request' is defined but never used.  @typescript-eslint/no-unused-vars
// [13:50:41.404] 
// [13:50:41.404] info  - Need to disable some ESLint rules? Learn more here: https://nextjs.org/docs/app/api-reference/config/eslint#disabling-rules
// [13:50:43.341] Failed to compile.
// [13:50:43.341] 
// [13:50:43.343] app/api/payment-status/route.tsx
// [13:50:43.343] Type error: File '/vercel/path0/web/app/api/payment-status/route.tsx' is not a module.
// [13:50:43.343] 
// [13:50:43.367] Next.js build worker exited with code: 1 and signal: null
// [13:50:43.384] Error: Command "next build" exited with 1
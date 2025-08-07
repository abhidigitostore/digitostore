// web/middleware.ts
import { withAuth } from 'next-auth/middleware';

export default withAuth(
  function middleware(req) {
    // This log will run for every request to the /admin page
    console.log('MIDDLEWARE: Path:', req.nextUrl.pathname);
    console.log('MIDDLEWARE: Sees token:', req.nextauth.token);
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // This determines if the user is authorized. The redirect happens if this returns false.
        console.log('MIDDLEWARE: "authorized" callback. Token exists:', !!token);
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/admin/:path*'],
};
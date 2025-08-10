// web/middleware.ts
export { default } from "next-auth/middleware";

export const config = {
  // This matcher ensures the middleware runs only on routes starting with /admin
  matcher: ["/admin/:path*"],
};
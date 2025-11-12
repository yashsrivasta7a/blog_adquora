import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware({
  publicRoutes: ["/", "/blog(.*)", "/api/blogs(.*)", "/sign-in", "/sign-up", "/sign-out"]
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
import {authMiddleware} from '@clerk/nextjs'

export default authMiddleware({
  publicRoutes: ["/", "/blog(.*)", "/api/blogs(.*)"]
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"]
};
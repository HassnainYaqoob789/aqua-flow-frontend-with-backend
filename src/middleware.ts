import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Read token from cookies
  const token = request.cookies.get("token")?.value;

  console.log(
    "Middleware triggered - Path:",
    pathname,
    "Token:",
    token ? "✅ Present" : "❌ Missing"
  );

  console.log("token",token)

  // If token exists (user logged in)
  if (token) {
    // Prevent logged-in users from accessing login page
    if (pathname === "/auth/login") {
      console.log("Redirecting to / because user is already logged in");
      return NextResponse.redirect(new URL("/", request.url));
    }
  } else {
    // If no token (user not logged in), block protected routes
    if (pathname !== "/auth/login") {
      console.log("Redirecting to /auth/login because user is not logged in");
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

// Add all your protected routes here
export const config = {
  matcher: [
    "/", 
    "/profile",
    "/customer/:path*",
    "/driver/:path*",
    "/expenses/:path*",
    "/inventory/:path*",
    "/order/:path*",
    "/products/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/tables/:path*",
    "/ui/:path*",
  ],
};

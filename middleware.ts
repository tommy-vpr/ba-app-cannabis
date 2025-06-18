import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const secret = process.env.NEXTAUTH_SECRET!;

// 🚫 Known bot signatures
const botKeywords = [
  "bot",
  "crawler",
  "spider",
  "curl",
  "wget",
  "python",
  "node",
];

function isBot(userAgent: string = "") {
  const ua = userAgent.toLowerCase();
  return botKeywords.some((bot) => ua.includes(bot));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 🚫 Block known bots
  const ua = req.headers.get("user-agent") || "";
  if (isBot(ua)) {
    return new NextResponse("Blocked bot", { status: 403 });
  }

  // ✅ Allow public/static paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/api/public")
  ) {
    return NextResponse.next();
  }

  const token = await getToken({ req, secret });

  // 🔒 Redirect unauthenticated users away from protected routes
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 🚀 Redirect authenticated users from "/" to "/dashboard"
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// 📍 Run middleware on all paths except static/internal assets
export const config = {
  matcher: ["/((?!_next|static|favicon.ico|images|api).*)"],
};

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getToken } from "next-auth/jwt";

// const secret = process.env.NEXTAUTH_SECRET!;

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   // ✅ Skip static assets and internal paths
//   if (
//     pathname.startsWith("/_next") ||
//     pathname.startsWith("/static") ||
//     pathname.startsWith("/favicon.ico") ||
//     pathname.startsWith("/images") ||
//     pathname.startsWith("/api/public")
//   ) {
//     return NextResponse.next();
//   }

//   const token = await getToken({ req, secret });

//   // 🔒 If not logged in and visiting protected page, redirect to "/"
//   if (!token && pathname.startsWith("/dashboard")) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   // 🚀 If logged in and visiting root "/", redirect to "/dashboard"
//   if (token && pathname === "/") {
//     return NextResponse.redirect(new URL("/dashboard", req.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!_next|static|favicon.ico|images|api).*)"],
// };

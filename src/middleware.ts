import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(req: NextRequest) {
  console.log("✅ Middleware hit:", req.nextUrl.pathname);

  const token = req.cookies.get("token")?.value;
  const path = req.nextUrl.pathname;

  if (path.startsWith("/api/questions")) {  
    if (req.method === "GET") {
      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.json(
        { error: "Your Session has expired" },
        { status: 401 },
      );
    }

    try {
      await jwtVerify(token, secret);
    } catch {
      return NextResponse.json(
        { error: "Your Session has expired" },
        { status: 401 }
      );
    }
    finally{
   return NextResponse.next();
  }
  }
}

export const config = {
  matcher: ["/api/questions/:path*"],
};

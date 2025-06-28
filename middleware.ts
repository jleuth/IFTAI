import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.headers.get("x-auth-token") || request.headers.get("authorization");
    const validToken = process.env.AUTH_TOKEN

    if (request.nextUrl.pathname.startsWith("/api")) {
        if (validToken && token !== validToken) {
            return new NextResponse(JSON.stringify({ error: "Unauthorized"}), {
                status: 401,
                headers: { "Content-Type": "application/json" },
            })
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: "/api/:path*"
}
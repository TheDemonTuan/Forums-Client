import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
		// await fetch(process.env.NEXT_PUBLIC_API_HOST + "auth/verify", {
		// 	method: "GET",
		// 	credentials: "include",
		// })
		if (request.cookies.has("tdt_utid")) {
			return NextResponse.redirect(new URL("/", request.nextUrl));
		}
	}
}

// See "Matching Paths" below to learn more
export const config = {
	matcher: ["/login", "/register"],
};

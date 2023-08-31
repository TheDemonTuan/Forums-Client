import { NextResponse } from "next/server";

//Google OAuth
const googleOAuthURL: string = "https://accounts.google.com/o/oauth2/v2/auth";
const googleClientID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
const googleCallBackURI: string = process.env.NEXT_PUBLIC_GOOGLE_CALLBACK_URI || "";

//Github OAuth
const githubOAuthURL: string = "https://github.com/login/oauth/authorize";
const githubClientID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || "";

export async function GET(request: Request, { params }: { params: { provider: string } }) {
	const provider = params.provider;

	switch (provider) {
		case "google":
			return NextResponse.redirect(
				`${googleOAuthURL}?client_id=${googleClientID}&redirect_uri=${googleCallBackURI}&response_type=code&scope=openid email profile`
			);
		case "github":
			return NextResponse.redirect(`${githubOAuthURL}?client_id=${githubClientID}`);
		default:
			return NextResponse.redirect(new URL("/login", request.url));
	}
}

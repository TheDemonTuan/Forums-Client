"use client";

import { usePreventRoute } from "@/hooks/usePreventRoute";
import type { Metadata } from "next";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const preventRoute = usePreventRoute();
	if (preventRoute) return preventRoute;
	return <GoogleReCaptchaProvider reCaptchaKey={`${process.env.NEXT_PUBLIC_GOOGLE_RECAPTCHA_V3_SITE_KEY}`}>{children}</GoogleReCaptchaProvider>;
}

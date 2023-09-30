"use client";

import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Script from "next/script";

const inter = Inter({
	subsets: ["latin"],
	preload: true,
	weight: ["400"],
	display: "swap",
});

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false,
			retry: false,
			staleTime: 1000 * 60 * 5,
		},
		mutations: {
			retry: false,
		},
	},
});
export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<Script src="https://unpkg.com/htmx.org@1.9.6" />
			<Script src="https://unpkg.com/hyperscript.org@0.9.11/dist/_hyperscript.min.js" />
			<body className={inter.className}>
				<QueryClientProvider client={queryClient}>
					{children}
					<ReactQueryDevtools initialIsOpen={false} />
				</QueryClientProvider>
			</body>
		</html>
	);
}

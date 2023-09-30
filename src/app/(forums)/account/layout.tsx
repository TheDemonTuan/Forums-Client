"use client";

import Breadcrumbs from "@/components/forums/Account/Breadcrumb";
import { SideBar } from "@/components/forums/Account/SideBar";
import { useProtectRoute } from "@/hooks/useProtectRoute";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	const protectRoute = useProtectRoute();

	if (protectRoute) return protectRoute;

	return (
		<div className="lg:flex lg_max:space-y-5 p-3 lg:p-8 lg:px-20 w-full h-full">
			<SideBar />
			<div className="lg:flex-auto bg-forum_white rounded-2xl p-5 lg_max:shadow-2xl z-10">
				<Breadcrumbs />
				{children}
			</div>
		</div>
	);
}

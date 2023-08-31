import Breadcrumbs from "@/components/forums/Account/Breadcrumb";
import SideBar from "@/components/forums/Account/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "My Account - TheDemonTuan",
	description: "Generated by create next app",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex py-3">
			<SideBar />
			<div className="flex-grow p-5">
				<Breadcrumbs />
				{children}
			</div>
		</div>
	);
}

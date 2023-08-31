"use client";

import { memo, useEffect, Dispatch, SetStateAction, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/styles/forums/Menu.module.css";
import Search from "./Search";

export type MenuDataType = {
	children: JSX.Element | ReactNode;
	link: string | null;
	customClass?: string;
};

export const MenuData: MenuDataType[] = [
	{
		children: "Home",
		link: "/",
	},
	{
		children: "Datapack",
		link: "/datapack",
	},
	{
		children: "Forums",
		link: "/forums",
	},
	{
		children: "FAQs",
		link: "/faqs",
	},
	{
		children: "About",
		link: "/about",
	},
	{
		link: null,
		customClass: "lg:hidden w-full",
		children: <Search />,
	},
];

const Menu = ({ menu, setMenu }: { menu: boolean; setMenu: Dispatch<SetStateAction<boolean>> }) => {
	const activeLink: string = usePathname();

	useEffect(() => {
		setMenu(false);
	}, [activeLink, setMenu]);

	return (
		<>
			<div
				className={`${
					menu &&
					"lg:hidden absolute left-0 top-[100%] z-10 w-[100vw] h-[100vh] bg-forum_black opacity-50 transition-all"
				}`}
				onClick={() => setMenu(!menu)}
			/>
			<ul className={`${styles?.["nav-items"]} ${menu && styles?.show}`}>
				{MenuData.map((item, index) => (
					<li key={index} className={`${!item.link && item?.customClass}`}>
						{item.link ? (
							<Link
								href={item.link}
								className={`${styles["nav-item"]} ${activeLink === item.link && styles.active} ${
									item?.customClass
								}`}>
								{item.children}
							</Link>
						) : (
							item.children
						)}
					</li>
				))}
			</ul>
		</>
	);
};

export default memo(Menu);

"use client";

import { memo, useEffect, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/styles/forums/Menu.module.css";
import Search from "./Search";

type MenuDataType = {
	children: JSX.Element | ReactNode;
	link: string | null;
	customClass?: string;
};

const MenuData: MenuDataType[] = [
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
		customClass: "lg:hidden w-full mt-5",
		children: <Search />,
	},
];

interface MenuProps {
	menu: boolean;
	setMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const Menu = ({ menu, setMenu }: MenuProps) => {
	const activeLink: string = usePathname();

	useEffect(() => {
		setMenu(false);
	}, [activeLink, setMenu]);

	return (
		<div className="flex-auto">
			{menu && <div className={styles?.["nav-background"]} onClick={() => setMenu(!menu)} />}
			<ul className={`${styles?.["nav-items"]} ${menu && styles?.show}`}>
				{MenuData.map((item, index) => (
					<li key={index} className={`${!item?.link && item?.customClass}`}>
						{item?.link ? (
							<Link
								href={item?.link}
								className={`${styles?.["nav-item"]} ${
									activeLink === item?.link && styles?.active
								} ${item?.customClass}`}>
								{item?.children}
							</Link>
						) : (
							item?.children
						)}
					</li>
				))}
			</ul>
		</div>
	);
};

export default memo(Menu);

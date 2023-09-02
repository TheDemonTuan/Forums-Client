/* eslint-disable react/display-name */
"use client";

import React, { memo, useEffect, useState } from "react";
import Link from "next/link";
import styles from "@/styles/forums/Nav.module.css";
import Menu from "./Menu";
import { UserNav } from "./UserNav";
import { AiOutlineClose, AiOutlineMenuUnfold } from "react-icons/ai";
import Image from "next/image";
import Search from "./Search";

const Nav = () => {
	// Sticky Navbar
	const [sticky, setSticky] = useState<boolean>(false);

	useEffect(() => {
		const handleScroll = () => (window.scrollY >= 80 ? setSticky(true) : setSticky(false));

		handleScroll();
		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// Show Menu
	const [menu, setMenu] = useState<boolean>(false);

	useEffect(() => {
		document.body.classList.toggle("overflow-hidden", menu);
	}, [menu]);

	return (
		<>
			{sticky && <div className="w-full h-[63px] lg:py-10" />}
			<nav
				className={`pl-5 pr-2 lg:px-5 lg:py-10 ${styles?.["nav-bar"]} ${sticky && styles?.active}`}>
				<LeftNav menu={menu} setMenu={setMenu} />
				<Menu menu={menu} setMenu={setMenu} />
				<UserNav />
			</nav>
		</>
	);
};

export default memo(Nav);

interface LeftNavProps {
	menu: boolean;
	setMenu: React.Dispatch<React.SetStateAction<boolean>>;
}

const LeftNav = memo(({ menu, setMenu }: LeftNavProps) => {
	return (
		<>
			<label className="lg:hidden pr-5 cursor-pointer swap swap-rotate">
				<input type="checkbox" onChange={() => setMenu(!menu)} aria-label="Menu" checked={menu} />
				<AiOutlineMenuUnfold className="swap-off fill-current" size={32} />
				<AiOutlineClose className="swap-on fill-current" size={32} />
			</label>
			<Link
				href="/"
				className="flex items-center lg_max:border-l border-solid border-forum_black h-full lg_max:pl-5">
				<Image src="/logo.webp" alt="Logo" width={80} height={80} loading="lazy" />
			</Link>
			<Search customClass="lg_max:hidden flex-auto" />
		</>
	);
});

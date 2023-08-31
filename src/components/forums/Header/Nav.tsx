"use client";

import React, { memo, useEffect, useState } from "react";
import Image from "next/image";
import { AiOutlineClose, AiOutlineMenuUnfold } from "react-icons/ai";
import Link from "next/link";
import styles from "@/styles/forums/Nav.module.css";
import Search from "./Search";
import Menu from "./Menu";
import UserNav from "./User-Nav";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

const Nav = () => {
	// Sticky Navbar
	const [sticky, setSticky] = useState<boolean>(false);

	useEffect(() => {
		const handleScroll = () => (window.scrollY >= 10 ? setSticky(true) : setSticky(false));

		handleScroll();
		window.addEventListener("scroll", handleScroll);

		return () => {
			window.removeEventListener("scroll", handleScroll);
		};
	}, []);

	// Show Menu
	const [menu, setMenu] = useState<boolean>(false);

	// Auth
	const { data: authData, isLoading: authLoading } = useAuth();
	return (
		<nav
			className={`flex justify-between items-center z-30 h-[63px] relative bg-forum_white w-full shadow-2xl lg:py-10 ${
				sticky && styles?.active
			}`}>
			<>
				<div className="flex items-center h-full">
					<label className="lg:hidden p-5 cursor-pointe swap swap-rotate">
						<input
							type="checkbox"
							onChange={() => setMenu(!menu)}
							aria-label="Menu"
							checked={menu}
						/>
						<AiOutlineMenuUnfold className="swap-off fill-current" size={32} />
						<AiOutlineClose className="swap-on fill-current" size={32} />
					</label>
					<Link
						href="/"
						className="flex items-center lg_max:border-l border-solid border-forum_black h-full px-5">
						<Image src="/logo.webp" alt="Logo" width={80} height={80} loading="lazy" />
					</Link>
				</div>
				<div className="lg_max:hidden flex-auto">
					<Search />
				</div>
				<div className="flex-auto">
					<Menu menu={menu} setMenu={setMenu} />
				</div>
				<div className="m-3">
					{authLoading && !authData && (
						<Skeleton className="h-12 w-12 rounded-full bg-forum_gray" />
					)}
					{!authLoading && authData?.userInfo && <UserNav />}
				</div>
			</>
		</nav>
	);
};

export default memo(Nav);

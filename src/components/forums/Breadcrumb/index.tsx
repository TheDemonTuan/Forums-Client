"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect } from "react";
import styles from "@/styles/forums/Breadcrumb.module.css";
import { AiOutlineHome } from "react-icons/ai";
import { CgFormatSlash } from "react-icons/cg";
import _ from "lodash";

const Breadcrumb = ({ title }: { title: string }) => {
	const pathname: string = usePathname();
	const [paths, setPaths] = React.useState<string[]>([]);

	useEffect(() => {
		setPaths(pathname.split("/"));
	}, [pathname]);

	return (
		<div
			className={`text-md lg:text-xl breadcrumbs flex flex-col justify-center items-center gap-5 text-forum_black p-3 lg:p-4 ${styles?.breadcrumb}`}>
			<h1 className="text-[24px] lg:text-[28px] uppercase font-semibold">{title}</h1>
			<nav aria-label="breadcrumb" className="w-full p-1 flex items-center justify-center">
				<ol className="flex h-8 font-medium">
					{paths.map((item, index, row) => (
						<li className="flex items-center capitalize" key={index}>
							{index ? <CgFormatSlash size={24} /> : undefined}
							{row.length === index + 1 ? (
								<span className="underline cursor-not-allowed opacity-50">{item}</span>
							) : (
								<Link
									className="flex items-center px-1 hover:underline hover:opacity-50"
									href={_.join(_.take(paths, 0), "/")}
									aria-label={`Redirect to ${index ? item : "home"}`}>
									{index ? item : <AiOutlineHome size={24} />}
								</Link>
							)}
						</li>
					))}
				</ol>
			</nav>
		</div>
	);
};

export default Breadcrumb;

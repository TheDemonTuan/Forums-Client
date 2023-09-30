"use client";

import { usePathsName } from "@/hooks/usePathsName";
import _ from "lodash";
import Link from "next/link";
import React from "react";
import { AiOutlineHome } from "react-icons/ai";
import { CgFormatSlash } from "react-icons/cg";

const Breadcrumbs = () => {
	const { paths } = usePathsName();

	return (
		<>
			<ol className="flex flex-wrap items-center pt-1 bg-transparent rounded-lg">
				{paths.map((path, index) => (
					<li key={index} className="flex items-center text-base leading-normal capitalize text-forum_gray">
						{index ? <CgFormatSlash size={24} /> : undefined}
						{paths.at(-1) === path ? (
							<span className="opacity-50 leading-normal cursor-not-allowed" aria-current="page">
								{path}
							</span>
						) : (
							<Link className="hover:opacity-50" href={_.join(_.take(paths, index + 1), "/") || "/"} aria-label={`Back to ${path}`}>
								{index ? path : <AiOutlineHome size={22} />}
							</Link>
						)}
					</li>
				))}
			</ol>
			<h6 className="mt-1 mb-3 font-bold capitalize">{paths[2] || "TheDemonTuan"}</h6>
		</>
	);
};

export default Breadcrumbs;

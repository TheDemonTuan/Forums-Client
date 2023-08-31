import { cn } from "@/libs/utils";
import React, { ReactNode } from "react";

const Container = ({ children, className }: { children: ReactNode; className?: string }) => {
	return (
		<div
			className={cn(
				"lg:max-w-[95%] lg:mx-auto sm:p-5 !py-10 my-10 bg-forum_white rounded-3xl shadow-2xl",
				className
			)}>
			{children}
		</div>
	);
};

export default Container;

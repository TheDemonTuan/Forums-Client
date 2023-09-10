import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface FormButtonProps extends ButtonProps {}

export const ForumButton = (props?: FormButtonProps) => {
	return (
		<Button
			{...props}
			className={cn(
				"p-5 px-6 bg-forum_pink rounded-full hover:bg-forum_white hover:text-forum_pink hover:ring-1 hover:ring-forum_pink",
				props?.className
			)}>
			{props?.children}
		</Button>
	);
};

export const ForumButtonOutline = (props?: FormButtonProps) => {
	return (
		<div className="flex justify-center items-center">
			<Button
				{...props}
				variant={"outline"}
				className={cn(
					"p-5 px-6 border-forum_pink rounded-full hover:bg-forum_pink hover:text-forum_white",
					props?.className
				)}>
				{props?.children}
			</Button>
		</div>
	);
};

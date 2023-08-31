import { Button } from "@/components/ui/button";
import React, { ReactNode } from "react";

export const ForumButton = ({ children }: { children: ReactNode }) => {
	return (
		<Button
			type="button"
			className="p-5 px-6 bg-forum_pink rounded-full hover:bg-forum_white hover:text-forum_pink">
			{children}
		</Button>
	);
};

export const ForumButtonOutline = ({ children }: { children: ReactNode }) => {
	return (
		<Button
			type="button"
			variant={"outline"}
			className="p-5 px-6 border-forum_pink rounded-full hover:bg-forum_pink hover:text-forum_white">
			{children}
		</Button>
	);
};

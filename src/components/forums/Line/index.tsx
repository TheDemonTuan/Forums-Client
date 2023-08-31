import { cn } from "@/libs/utils";
import React from "react";

const Line = ({ className }: { className?: string }) => {
	return <div className={cn("h-px w-full bg-forum_black", className)} />;
};

export default Line;

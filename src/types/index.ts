import { ReactNode } from "react";

export type ButtonProps = {
	children: ReactNode;
	type?: "button" | "submit" | "reset";
	onClick?: () => void;
	className?: string;
	disabled?: boolean;
	isLoading?: boolean;
};

export type InputProps = {
	type: "text" | "password" | "email" | "number";
	label: string;
	name: string;
	placeholder?: string;
	className?: string;
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
	disabled?: boolean;
	required?: boolean;
};

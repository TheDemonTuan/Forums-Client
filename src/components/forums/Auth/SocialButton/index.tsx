"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { BsGithub } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

const SocialButton = () => {
	const router = useRouter();

	const handleSocialRedirect = (
		e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
		provider: string
	) => {
		e.preventDefault();
		const button = e.target as HTMLButtonElement;
		button.disabled = true;
		button.appendChild(document.createElement("span")).className =
			"loading loading-bars loading-xs";
		router.push(`/oauth/${provider}`);
	};

	return (
		<div className="grid grid-cols-2 gap-3">
			<Button
				type="button"
				variant="outline"
				className="w-full space-x-1"
				onClick={(e) => handleSocialRedirect(e, "github")}
				aria-label="Sign in with Github">
				<BsGithub className="mr-2 h-4 w-4" />
				Github
			</Button>
			<Button
				type="button"
				variant="outline"
				className="w-full space-x-1"
				onClick={(e) => handleSocialRedirect(e, "google")}
				aria-label="Sign in with Google">
				<FcGoogle className="mr-2 h-4 w-4" />
				Google
			</Button>
		</div>
	);
};

export default SocialButton;

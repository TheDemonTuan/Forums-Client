"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import React from "react";

const Account = () => {
	const { data: authData } = useAuth();

	return (
		<>
			<div className="relative flex flex-col flex-auto min-w-0 p-4 overflow-hidden break-words border-0 shadow-2xl rounded-2xl bg-forum_white bg-clip-border mb-4">
				<div className="flex flex-wrap">
					<Avatar className="text-base h-20 w-20 relative inline-flex items-center rounded-xl justify-center mr-2">
						<AvatarImage src={authData?.userInfo?.avatar} alt="User Avatar" />
						<AvatarFallback>Avatar</AvatarFallback>
					</Avatar>
					<div className="flex-none w-auto max-w-full px-3 my-auto">
						<div className="h-full">
							<h1 className="font-semibold text-lg">{authData?.userInfo?.username}</h1>
							<h2 className="mb-1 text-forum_gray text-sm">@{authData?.userInfo?.display_name}</h2>
							<p className="mb-0 leading-normal text-sm">
								Role: {authData?.userInfo?.role ? "Admin" : "Member"}
							</p>
						</div>
					</div>
					<div className="w-full max-w-full px-3 mx-auto mt-4 sm:my-auto sm:mr-0 md:w-1/2 md:flex-none lg:w-4/12"></div>
				</div>
			</div>
		</>
	);
};

export default Account;

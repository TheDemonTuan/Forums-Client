import Email from "@/components/forums/Account/Private/Email";
import UserName from "@/components/forums/Account/Private/UserName";
import React from "react";
import { AiFillWarning } from "react-icons/ai";

const Private = () => {
	return (
		<>
			<div className="alert alert-warning my-5">
				<AiFillWarning className="text-xl" />
				<span>Careful before change your private information !</span>
			</div>
			<div className="grid grid-flow-row lg:grid-flow-col gap-12 lg:gap-28">
				<UserName />
				<Email />
			</div>
		</>
	);
};

export default Private;

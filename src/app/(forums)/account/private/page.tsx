import Email from "@/components/forums/Account/Private/Email";
import UserName from "@/components/forums/Account/Private/UserName";
import React from "react";
import { AiFillWarning } from "react-icons/ai";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Private = () => {
	return (
		<>
			<Alert variant="warning" className="my-5">
				<AiFillWarning size={21} />
				<AlertTitle>Warning</AlertTitle>
				<AlertDescription>Careful before change your private information !</AlertDescription>
			</Alert>
			<div className="grid grid-flow-row lg:grid-flow-col gap-12 lg:gap-28">
				<UserName />
				<Email />
			</div>
		</>
	);
};

export default Private;

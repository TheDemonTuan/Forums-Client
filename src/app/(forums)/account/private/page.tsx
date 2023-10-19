import React from "react";
import { AiFillWarning } from "react-icons/ai";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PrivateUserName from "@/components/forums/Account/Private/PrivateUserName";
import PrivateEmail from "@/components/forums/Account/Private/PrivateEmail";

const Private = () => {
	return (
		<>
			<Alert variant="warning" className="my-5">
				<AiFillWarning size={21} />
				<AlertTitle>Warning</AlertTitle>
				<AlertDescription>Careful before change your private information !</AlertDescription>
			</Alert>
			<div className="grid grid-flow-row lg:grid-flow-col gap-12 lg:gap-28">
				<PrivateUserName />
				<PrivateEmail />
			</div>
		</>
	);
};

export default Private;

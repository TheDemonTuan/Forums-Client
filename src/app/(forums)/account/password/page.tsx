import PasswordForm from "@/components/forums/Account/Password/PasswordForm";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import React from "react";
import { AiFillWarning } from "react-icons/ai";

const Password = () => {
	return (
		<>
			<Alert variant="warning" className="my-5">
				<AiFillWarning size={21} />
				<AlertTitle>Warning</AlertTitle>
				<AlertDescription>If you change your password successful all old sessions will be revoke !</AlertDescription>
			</Alert>
			<div className="lg:w-1/2">
				<PasswordForm />
			</div>
		</>
	);
};

export default Password;

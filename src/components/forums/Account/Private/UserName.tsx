import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import PrivateUserNameForm from "./PrivateUserNameForm";

const UserName = () => {
	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Change username</CardTitle>
				<CardDescription></CardDescription>
			</CardHeader>
			<CardContent>
				<PrivateUserNameForm />
			</CardContent>
			{/* <CardFooter className="flex justify-between">
			</CardFooter> */}
		</Card>
	);
};

export default UserName;

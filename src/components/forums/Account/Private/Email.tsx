import React from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import PrivateEmailForm from "./PrivateEmailForm";

const Email = () => {
	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle>Change email</CardTitle>
				<CardDescription></CardDescription>
			</CardHeader>
			<CardContent>
				<PrivateEmailForm />
			</CardContent>
			{/* <CardFooter className="flex justify-between">
			</CardFooter> */}
		</Card>
	);
};

export default Email;

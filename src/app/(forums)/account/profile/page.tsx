import ProfileForm from "@/components/forums/Account/Profile/ProfileForm";
import React from "react";
import { AiFillWarning } from "react-icons/ai";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Profile = () => {
	return (
		<>
			<Alert variant="warning" className="my-5">
				<AiFillWarning size={21} />
				<AlertTitle>Warning</AlertTitle>
				<AlertDescription>This information will be displayed publicly so be careful what you share !</AlertDescription>
			</Alert>
			<ProfileForm />
		</>
	);
};

export default Profile;

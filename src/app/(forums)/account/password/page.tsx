import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import dynamic from "next/dynamic";
import React from "react";
import { AiFillWarning } from "react-icons/ai";

const PasswordForm = dynamic(() => import("@/components/forums/Account/Password/PasswordForm"), {
  loading: () => <p>Loading...</p>,
});

const Password = () => {
  return (
    <>
      <Alert variant="warning" className="my-5">
        <AiFillWarning size={21} />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>
          If you change your password successful all old sessions will be revoke !
        </AlertDescription>
      </Alert>
      <div className="lg:w-1/2">
        <PasswordForm />
      </div>
    </>
  );
};

export default Password;

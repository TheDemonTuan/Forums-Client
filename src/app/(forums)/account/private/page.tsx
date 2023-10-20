"use client";

import React from "react";
import { AiFillWarning } from "react-icons/ai";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FaUserEdit } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dynamic from "next/dynamic";
import { useAccountStore } from "@/lib/store/accountStore";

const PrivateUserNameForm = dynamic(
  () => import("@/components/forums/Account/Private/UserName/PrivateUserNameForm"),
  {
    loading: () => <p>Loading...</p>,
  }
);
const PrivateEmailForm = dynamic(
  () => import("@/components/forums/Account/Private/Email/PrivateEmailForm"),
  {
    loading: () => <p>Loading...</p>,
  }
);
const PrivatePasswordForm = dynamic(
  () => import("@/components/forums/Account/Private/Password/PrivatePasswordForm"),
  {
    loading: () => <p>Loading...</p>,
  }
);

const privateData = [
  {
    value: "username",
    label: "Username",
    icon: FaUserEdit,
    content: <PrivateUserNameForm />,
  },
  {
    value: "email",
    label: "Email",
    icon: MdEmail,
    content: <PrivateEmailForm />,
  },
  {
    value: "password",
    label: "Password",
    icon: RiLockPasswordFill,
    content: <PrivatePasswordForm />,
  },
];

const Private = () => {
  const { isFormHandle } = useAccountStore();
  return (
    <>
      <Alert variant="warning" className="my-5">
        <AiFillWarning size={21} />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>Careful before change your private information !</AlertDescription>
      </Alert>
      <Tabs
        defaultValue={privateData[0]?.value}
        className={`flex flex-col justify-center items-center ${
          isFormHandle && "pointer-events-none opacity-50"
        }`}
      >
        <TabsList>
          {privateData.map((item, index) => (
            <TabsTrigger key={index} value={item?.value} className="flex gap-1 justify-center">
              {item?.icon && <item.icon />} {item?.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {privateData.map((item, index) => (
          <TabsContent key={index} value={item?.value} className="lg:w-1/2">
            <Card>
              <CardHeader>
                <CardTitle className="uppercase">Change {item?.label}</CardTitle>
                <CardDescription></CardDescription>
              </CardHeader>
              <CardContent>{item?.content}</CardContent>
              {/* <CardFooter className="flex justify-between">test</CardFooter> */}
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default Private;

import Link from "next/link";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SocialButton from "@/components/forums/Auth/SocialButton";
import dynamic from "next/dynamic";

const RegisterForm = dynamic(() => import("@/components/forums/Auth/Register/RegisterForm"), {
  loading: () => <p>Loading...</p>,
});

const Register = () => {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>Sign in to access your account</CardDescription>
      </CardHeader>
      <div className="divider" />
      <CardContent className="grid gap-5 p-4">
        <SocialButton/>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <RegisterForm/>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-center sm:px-6 mb-3">
          Already have an account?
          <Link href="/login" className="ml-1 underline hover:text-forum_pink">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </>
  );
};

export default Register;

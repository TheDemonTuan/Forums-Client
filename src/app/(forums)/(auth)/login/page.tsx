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
<<<<<<< HEAD
import SocialButton from "@/components/forums/Auth/SocialButton";
import { Metadata } from "next";
import dynamic from "next/dynamic";

const LoginForm = dynamic(() => import("@/components/forums/Auth/Login/LoginForm"), {
  loading: () => <p>Loading...</p>,
});
=======
import LoginForm from "@/components/forums/Auth/Login/LoginForm";
import SocialButton from "@/components/forums/Auth/SocialButton";
import { Metadata, ResolvingMetadata } from "next";
>>>>>>> c58e3b02d0443a4187075c7d2b23c9a1cc4122d4

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Sign In",
  };
}

const Login = () => {
  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>Sign in to access your account</CardDescription>
      </CardHeader>
      <div className="divider" />
      <CardContent className="grid gap-5 p-4">
        <SocialButton />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <LoginForm/>
      </CardContent>
      <CardFooter className="justify-center">
        <p className="text-sm text-center sm:px-6 mb-3">
          Don&apos;t have an account?
          <Link href="/register" className="ml-1 underline hover:text-forum_pink">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </>
  );
};

export default Login;

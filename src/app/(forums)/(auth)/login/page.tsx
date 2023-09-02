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
import LoginForm from "@/components/forums/Auth/Login/LoginForm";
import Breadcrumb from "@/components/forums/Breadcrumb";
import SocialButton from "@/components/forums/Auth/SocialButton";

const Login = () => {
	return (
		<>
			<Breadcrumb title="Sign in" />
			<Card className="w-[90%] lg:w-[30%] mx-auto my-10">
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
					<LoginForm />
				</CardContent>
				<CardFooter className="justify-center">
					<p className="text-sm text-center sm:px-6 mb-3">
						Don&apos;t have an account?
						<Link href="/register" className="ml-1 underline hover:text-forum_pink">
							Sign up
						</Link>
					</p>
				</CardFooter>
			</Card>
		</>
	);
};

export default Login;

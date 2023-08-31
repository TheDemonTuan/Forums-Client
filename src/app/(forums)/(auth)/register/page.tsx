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
import Line from "@/components/forums/Line";
import RegisterForm from "@/components/forums/Register/RegisterForm";
import Breadcrumb from "@/components/forums/Breadcrumb";
import SocialButton from "@/components/forums/SocialButton";

const Register = () => {
	return (
		<>
			<Breadcrumb title="Sign Up" />
			<Card className="w-[90%] lg:w-[30%] mx-auto my-10">
				<CardHeader>
					<CardTitle className="text-2xl">Sign Up</CardTitle>
					<CardDescription>Sign in to access your account</CardDescription>
				</CardHeader>
				<Line className="mb-1" />
				<CardContent className="grid gap-5 p-8">
					<SocialButton />
					<div className="relative">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t" />
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-background px-2 text-muted-foreground">Or continue with</span>
						</div>
					</div>
					<RegisterForm />
				</CardContent>
				<CardFooter className="justify-center">
					<p className="text-sm text-center sm:px-6 mb-3">
						Already have an account?
						<Link href="/login" className="ml-1 underline hover:text-forum_pink">
							Sign in
						</Link>
					</p>
				</CardFooter>
			</Card>
		</>
	);
};

export default Register;

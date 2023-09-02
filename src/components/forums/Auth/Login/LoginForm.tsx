"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { ValidateLoginFormSchema, ValidateLoginForm } from "./login-form.validate";
import _ from "lodash";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoginBody, AuthResponse, loginAuth } from "@/lib/authApi";
import { ApiErrorResponse } from "@/utils/http";
import { ForumButtonOutline } from "../../Button";

const LoginForm = () => {
	const router = useRouter();
	const queryClient = useQueryClient();

	const { isLoading, mutate } = useMutation<AuthResponse, ApiErrorResponse, LoginBody>({
		mutationFn: async (body) => await loginAuth(body),
		onSuccess: (data) => {
			loginForm.reset();
			router.replace("/");
			queryClient.setQueryData(["auth"], data);
			toast.success("Login successful!");
		},
		onError: (err) => {
			toast.error(_.get(err?.response?.data, "message", "Login failed!"));
		},
	});

	const loginForm = useForm<ValidateLoginForm>({
		resolver: zodResolver(ValidateLoginFormSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});
	const handleLogin = async (values: ValidateLoginForm) => {
		mutate({
			username: values.username,
			password: values.password,
		});
	};

	return (
		<Form {...loginForm}>
			<form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-5">
				<FormField
					control={loginForm.control}
					name="username"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Username</FormLabel>
							<FormControl>
								<Input type="text" placeholder="example" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={loginForm.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Password</FormLabel>
							<FormControl>
								<Input type="password" placeholder="1234****" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<ForumButtonOutline type="submit" className="w-full" disabled={isLoading}>
					{isLoading && <span className="loading loading-spinner loading-xs mr-2" />}
					{!isLoading ? "Login" : "Loading..."}
				</ForumButtonOutline>
			</form>
		</Form>
	);
};

export default LoginForm;

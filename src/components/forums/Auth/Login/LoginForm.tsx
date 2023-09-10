"use client";

import React, { memo, useCallback, useState } from "react";
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
import { LoginAuthBody, AuthResponse, loginAuth } from "@/lib/authApi";
import { ApiErrorResponse } from "@/utils/http";
import { ForumButtonOutline } from "../../Button";
import { useGoogleRecaptchaV3 } from "@/hooks/useGoogleRecaptcha";

const LoginForm = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { handleReCaptchaVerify } = useGoogleRecaptchaV3();
	const [recaptchaLoading, setRecaptchaLoading] = useState<boolean>(false);

	const { isLoading, mutate } = useMutation<AuthResponse, ApiErrorResponse, LoginAuthBody>({
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

	const handleLogin = useCallback(
		async (values: ValidateLoginForm) => {
			setRecaptchaLoading(true);
			const recaptcha = await handleReCaptchaVerify();

			if (!recaptcha) {
				toast.error("Please verify reCaptcha!");
				return;
			}
			setRecaptchaLoading(false);

			mutate({
				...values,
				recaptcha,
			});
		},
		[handleReCaptchaVerify, mutate]
	);

	return (
		<>
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
					<ForumButtonOutline
						type="submit"
						className="w-full"
						disabled={isLoading || recaptchaLoading}>
						{isLoading || recaptchaLoading ? (
							<span className="loading loading-spinner loading-xs mr-2" />
						) : (
							""
						)}
						{!isLoading && !recaptchaLoading ? "Login" : "Loading..."}
					</ForumButtonOutline>
				</form>
			</Form>
		</>
	);
};

export default memo(LoginForm);

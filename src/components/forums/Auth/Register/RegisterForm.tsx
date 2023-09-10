"use client";

import React, { memo, useCallback, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { ValidateRegisterForm, ValidateRegisterFormSchema } from "./register-form.validate";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import _ from "lodash";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { RegisterAuthBody, AuthResponse, registerAuth } from "@/lib/authApi";
import { ApiErrorResponse } from "@/utils/http";
import { ForumButtonOutline } from "@/components/forums/Button";
import { useGoogleRecaptchaV3 } from "@/hooks/useGoogleRecaptcha";

const RegisterForm = () => {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { handleReCaptchaVerify } = useGoogleRecaptchaV3();
	const [recaptchaLoading, setRecaptchaLoading] = useState<boolean>(false);

	const { isLoading, mutate } = useMutation<AuthResponse, ApiErrorResponse, RegisterAuthBody>({
		mutationFn: async (body) => await registerAuth(body),
		onSuccess: (data) => {
			form.reset();
			router.replace("/");
			queryClient.setQueryData(["auth"], data);
			toast.success("Register successful!");
		},
		onError: (err) => {
			toast.error(_.get(err?.response?.data, "message", "Register failed!"));
		},
	});

	const form = useForm<ValidateRegisterForm>({
		resolver: zodResolver(ValidateRegisterFormSchema),
		defaultValues: {
			email: "",
			username: "",
			password: "",
			confirm_password: "",
		},
	});

	const handleRegister = useCallback(
		async (values: ValidateRegisterForm) => {
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
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleRegister)} className="space-y-5">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input type="email" placeholder="example@example.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
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
					control={form.control}
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
				<FormField
					control={form.control}
					name="confirm_password"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Confirm password</FormLabel>
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
					{!isLoading && !recaptchaLoading ? "Register" : "Loading..."}
				</ForumButtonOutline>
			</form>
		</Form>
	);
};

export default memo(RegisterForm);
